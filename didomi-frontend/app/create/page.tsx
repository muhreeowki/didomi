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
import { ContainerIcon } from "lucide-react";
import * as React from "react";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { CreateProjectFormSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldName, FieldValue, SubmitHandler, useForm } from "react-hook-form";

import * as anchor from "@coral-xyz/anchor";
import * as walletAdapterReact from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import { DidomiProgram } from "../../../didomi-program/target/types/didomi_program";
import idl from "../../../didomi-program/target/idl/didomi_program.json";

const CreateProject = () => {
  // UTILS
  const router = useRouter();

  // UI CONFIG
  const { toast } = useToast();

  // ZOD FORM CONFIG
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
      escrowAddress: "adfgjuyfhgrwtrtopeiruqefdfa",
      accountAddress: "adfgjuyfhgrwtrtopeiruqefdfa",
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
  // Form Functions
  const nextStep = async () => {
    const fields = formSteps[currentStep].fields;
    const result = await form.trigger(fields as FieldName[], {
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

  // SOLANA CONFIG
  const wallet = walletAdapterReact.useWallet();
  const userWallet = walletAdapterReact.useAnchorWallet();
  const { connection } = walletAdapterReact.useConnection();
  const programID = new web3.PublicKey(idl.address);

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
    const userPubKey = wallet.publicKey.toString();
    const provider = getProvider();
    if (!provider) {
      console.error("Provider is not available.");
      return;
    }
    const program = new anchor.Program<DidomiProgram>(
      idl as DidomiProgram,
      provider
    );
    // TODO: FIX THIS
    const [projectAddress] = anchor.web3.PublicKey.findProgramAddressSync(
      [provider.publicKey?.toBuffer(), Uint8Array.from("coolproject")],
      program.programId
    );
    const [escrowAddress] = anchor.web3.PublicKey.findProgramAddressSync(
      [provider.publicKey?.toBuffer(), projectAddress.toBuffer()],
      program.programId
    );
    // 2. Connect the user's wallet and sign them in
    const user = await axios
      .get(`${"http://localhost:8000"}/users/${userPubKey}`)
      .then(async (response) => {
        // 2. Create user if user does not exist
        if (response.data == "") {
          console.log("user not found, creating user...");
          const { data } = await axios.post(
            `${"http://localhost:8000"}/users`,
            {
              walletAddress: userPubKey,
            }
          );
          console.log(data);
          return data;
        } else {
          console.log("user found, returning user...");
          console.log(response.data);
          return response.data;
        }
      })
      .catch((err) => console.error(err));
    // 3. Create Project On Backend Server
    const project = await axios
      .post(`${"http://localhost:8000"}/projects`, {
        ...data,
        accountAddress: projectAddress.toString(),
        escrowAddress: escrowAddress.toString(),
        acceptedCoins: [data.acceptedCoins],
        ownerAddress: userPubKey,
        ownerId: String(user.id),
      })
      .then((response) => {
        console.log("project created!");
        console.log(response.data);
        return response.data;
      })
      .catch((err) => console.error(err));

    if (!project) {
      console.error("Unable to Create Project.");
      return;
    }

    // 4. Create Project on Solana
    try {
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
          new anchor.BN(project.targetAmount)
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
        await axios.delete(`${"http://localhost:8000"}/projects/${project.id}`);
      }
      console.error(error);
      return;
    }
  };

  // PAGE TSX
  return (
    <>
      <main>
        <Form {...form}>
          <form
            className="flex flex-col justify-center items-center gap-4"
            onSubmit={form.handleSubmit(create)}
          >
            <h1 className="text-4xl font-semibold mb-6">Create Your Project</h1>
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
