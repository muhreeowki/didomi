"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { categories, tokens } from "@/lib/enums";
import { useToast } from "@/components/ui/use-toast";
import * as React from "react";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { CreateProjectFormSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldName, useForm } from "react-hook-form";

import * as anchor from "@coral-xyz/anchor";
import * as walletAdapterReact from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import { DidomiProgram } from "@/contract/didomi_program";
import idl from "@/contract/IDL.json";
import DashboardNavbar from "@/components/DashboardNavbar";
import { BackendError, SolanaError } from "@/lib/exceptions";

const CreateProject = () => {
  // Routing Config
  const router = useRouter();

  // Ui Config
  const { toast } = useToast();

  // Form Handling
  type Inputs = z.infer<typeof CreateProjectFormSchema>;
  const [currentStep, setCurrentStep] = React.useState(0);
  const form = useForm<Inputs>({
    resolver: zodResolver(CreateProjectFormSchema),
    defaultValues: {
      title: "",
      story: "",
      imageURL: "",
      websiteURL: "",
      acceptedCoins: "SOL",
      targetAmount: 0,
      category: "",
      ownerAddress: "",
      escrowAddress: "",
      accountAddress: "",
    },
  });

  const formSteps = [
    {
      id: "step1",
      name: "Info",
      fields: ["title", "story", "category"],
    },
    {
      id: "step2",
      name: "Funding",
      fields: ["targetAmount", "acceptedCoins"],
    },
    {
      id: "step3",
      name: "Media",
      fields: ["imageURL", "websiteURL"],
    },
  ];

  // Form Stepper Functions
  const nextStep = async () => {
    const fields = formSteps[currentStep].fields;
    const result = await form.trigger(fields as FieldName<Inputs>[], {
      shouldFocus: true,
    });
    if (!result) return;
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Solana connection Setup
  const wallet = walletAdapterReact.useWallet();
  const userWallet = walletAdapterReact.useAnchorWallet();
  const { connection } = walletAdapterReact.useConnection();
  const programID = new web3.PublicKey(idl.address);

  // Solana setup
  const getProvider = () => {
    if (!userWallet) return null;
    return new anchor.AnchorProvider(connection, userWallet, {
      preflightCommitment: "processed",
    });
  };

  const { data: session, status } = useSession();
  const loading = status === "loading";

  // MAIN FUNCTION
  const create = async (data: Inputs) => {
    // 0. Check that wallet is connected
    if (!wallet.connected || status !== "authenticated" || !wallet.publicKey) {
      return;
    }
    // 1. Connect to Solana
    const provider = getProvider();
    if (!provider) {
      console.error("Provider is not available.");
      return;
    }
    // Collect Needed Addresses
    const userPubKey = provider.publicKey.toString();
    const program = new anchor.Program<DidomiProgram>(
      idl as DidomiProgram,
      provider,
    );
    const [projectAddress] = anchor.web3.PublicKey.findProgramAddressSync(
      [provider.publicKey?.toBuffer(), Buffer.from("coolproject")],
      program.programId,
    );
    const [escrowAddress] = anchor.web3.PublicKey.findProgramAddressSync(
      [provider.publicKey?.toBuffer(), projectAddress.toBuffer()],
      program.programId,
    );
    // 2. Check if the user exists in backend
    const user = await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/users/${userPubKey}`)
      .then(async (response) => {
        // Create user if user does not exist
        if (response.data == "") {
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/users`,
            {
              walletAddress: userPubKey,
            },
          );
          return data;
        } else {
          return response.data;
        }
      })
      .catch((err) => console.error(err));
    // 3. Create Project On Backend Server
    const project = await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
        ...data,
        accountAddress: projectAddress.toString(),
        escrowAddress: escrowAddress.toString(),
        acceptedCoins: [data.acceptedCoins],
        ownerAddress: userPubKey,
        ownerId: String(user.id),
      })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        throw new BackendError();
      });

    if (!project) {
      throw new BackendError();
    }

    // 4. Create Project on Solana
    try {
      // Converting String to type [u8: 64] in Rust
      const encoder = new TextEncoder();
      const titleBytes = encoder.encode(project.title as string);
      const projectTitle = new Uint8Array(64);
      projectTitle.set(titleBytes, 0);
      for (let i: number = titleBytes.length; i < 64; i++) {
        projectTitle[i] = 0;
      }
      const tx = await program.methods
        .createProject(
          new anchor.BN(project.id),
          new anchor.BN(project.ownerId),
          Array.from(projectTitle),
          new anchor.BN(project.targetAmount),
        )
        .accountsStrict({
          owner: userWallet?.publicKey,
          project: projectAddress,
          escrow: escrowAddress,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();
      // 6. Completed
      console.log("Created Project:");
      console.log(project);
      console.log("Transaction Hash");
      console.log(tx);
      router.push(`/projects/${project.id}`);
    } catch (error) {
      if (project) {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/projects/${project.id}`,
        );
      }
      throw new SolanaError();
    }
  };

  // PAGE TSX
  return (
    <>
      <main className="h-screen overflow-scroll bg-muted">
        <DashboardNavbar />
        <Form {...form}>
          <form
            className="flex container px-4 flex-col justify-center items-center gap-4"
            onSubmit={form.handleSubmit(create)}
          >
            <div className="text-left border-b">
              <h3 className="font-semibold tracking-tight text-3xl leading-5 mt-10">
                Create Project
              </h3>
              <p className="text-base text-muted-foreground my-5">
                Get started with Didomi by creating your first Project.
              </p>
            </div>
            <Tabs
              defaultValue="step1"
              className="max-w-screen-md"
              value={formSteps[currentStep].id}
            >
              <TabsList>
                <TabsTrigger value="step1">Step 1</TabsTrigger>
                <TabsTrigger value="step2">Step 2</TabsTrigger>
                <TabsTrigger value="step3">Step 3</TabsTrigger>
              </TabsList>
              <TabsContent value="step1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">
                      Tell us About your Project
                    </CardTitle>
                    <CardDescription>
                      Write about your goals and what you plan on accomplishing.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field, fieldState, formState }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Bob's Fundraiser" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="story"
                      render={({ field, fieldState, formState }) => (
                        <FormItem>
                          <FormLabel>Your Story</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Hi, my name is bob..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field, fieldState, formState }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a Category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category: string, i: number) => (
                                <SelectItem key={i} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end">
                      <Button type="button" className="" onClick={nextStep}>
                        Continue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="step2">
                <Card className="mx-auto overflow-hidden max-w-screen-md justify-between">
                  <CardHeader>
                    <CardTitle className="text-xl">What do you need?</CardTitle>
                    <CardDescription>
                      Enter the amount and token type that you need to achieve
                      your Goals.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="targetAmount"
                      render={({ field, fieldState, formState }) => (
                        <FormItem className="">
                          <FormLabel>Target Amount</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              placeholder="1000"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="acceptedCoins"
                      render={({ field, fieldState, formState }) => (
                        <FormItem className="">
                          <FormLabel>Token</FormLabel>
                          <Select onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a Token" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {tokens.map((token: string) => (
                                <SelectItem key={token} value={token}>
                                  {token}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between">
                      <Button
                        type="button"
                        variant={"outline"}
                        className=""
                        onClick={prevStep}
                      >
                        Back
                      </Button>
                      <Button type="button" className="" onClick={nextStep}>
                        Continue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="step3">
                <Card className="mx-auto overflow-hidden max-w-screen-md justify-between">
                  <CardHeader>
                    <CardTitle className="text-xl">Media</CardTitle>
                    <CardDescription>
                      Provide an Image and website link so that people can know
                      more about your project.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="imageURL"
                      render={({ field, fieldState, formState }) => (
                        <FormItem>
                          <FormLabel>Image Link</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="https://youtu.be/..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="websiteURL"
                      render={({ field, fieldState, formState }) => (
                        <FormItem>
                          <FormLabel>Project Link</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="https://youtu.be/..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-between">
                      <Button
                        type="button"
                        variant={"outline"}
                        className=""
                        onClick={prevStep}
                      >
                        Back
                      </Button>
                      <Button type="submit" className="">
                        Finish
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </main>
    </>
  );
};

export default CreateProject;
