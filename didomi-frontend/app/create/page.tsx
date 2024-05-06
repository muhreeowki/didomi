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
import * as React from "react";
import axios from "axios";
import { z } from "zod";
import { CreateProjectFormSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldName, FieldValue, SubmitHandler, useForm } from "react-hook-form";
import * as anchor from "@coral-xyz/anchor";
import * as walletAdapterReact from "@solana/wallet-adapter-react";
import { DidomiProgram } from "../../../didomi-program/target/types/didomi_program";
import idl from "../../../didomi-program/target/idl/didomi_program.json";
import { useToast } from "@/components/ui/use-toast";
import { ContainerIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const CreateProject = () => {
  // UTILS
  const router = useRouter();

  // UI CONFIG
  const { toast } = useToast();

  // ZOD FORM CONFIG
  type Inputs = z.infer<typeof CreateProjectFormSchema>;
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

  const [currentStep, setCurrentStep] = React.useState(0);
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

  // Form Stepper Function
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
  const { data: session, status } = useSession();
  const loading = status === "loading";

  // MAIN FUNCTION
  const create = async (data: Inputs) => {
    // 0. Check that wallet is connected
    if (!wallet.connected || status !== "authenticated" || !wallet.publicKey) {
      return;
    }
    const userPubKey = wallet.publicKey.toString();
    // 0.2 Connect the user's wallet and sign them in
    const user = await axios
      .get(`http://localhost:8000/users/${userPubKey}`)
      .then(async (response) => {
        // 2. Create user if user does not exist
        if (response.data == "") {
          console.log("user not found, creating user...");
          const { data } = await axios.post(`http://localhost:8000/users`, {
            walletAddress: userPubKey,
          });
          console.log(data);
          return data;
        } else {
          console.log("user found, returning user...");
          console.log(response.data);
          return response.data;
        }
      })
      .catch((err) => console.error(err));
    // 3. Create Project On Backend
    const project = await axios
      .post("http://localhost:8000/projects", {
        ...data,
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
    // 4. Connect to Solana
    // const program = new anchor.Program(idl, provider);
    // const [address] = anchor.web3.PublicKey.findProgramAddressSync(
    //   [provider.publicKey?.toBuffer()],
    //   program.programId
    // );
    // 5. Create Project on Solana
    // TODO: Call createproject instruction onchain
    // 6. Completed
    console.log("Created Project:");
    console.log(project);
    router.push(`/projects/${project.id}`);
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
