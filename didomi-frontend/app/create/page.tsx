"use client";

import { Button } from "@/components/ui/button";
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
import { CreateProjectFormSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import axios from "axios";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import * as anchor from "@coral-xyz/anchor";
import * as walletAdapterReact from "@solana/wallet-adapter-react";
import { DidomiProgram } from "../../../didomi-program/target/types/didomi_program";
import idl from "../../../didomi-program/target/idl/didomi_program.json";
import { useToast } from "@/components/ui/use-toast";
import { ContainerIcon } from "lucide-react";

const CreateProject = () => {
  // UI CONFIG
  const { toast } = useToast();
  // ZOD FORM CONFIG
  type Inputs = z.infer<typeof CreateProjectFormSchema>;
  const form = useForm<Inputs>({
    resolver: zodResolver(CreateProjectFormSchema),
    defaultValues: {
      title: "",
      story: "",
      youtubeURL: "",
      acceptedCoins: "SOL",
      targetAmount: 0,
      category: "",
      ownerAddress: "",
      accountAddress: "",
    },
  });
  // SOLANA CONFIG

  const create = async (data: Inputs) => {
    // 0. Check that wallet is connected
    // if (!userWallet.connected || !connection) {
    //   await userWallet.wallet?.adapter.connect();
    //   return;
    // }
    // 0.2 Connect the user's wallet and sign them in
    // 1. Check if user exists
    // const user = await axios
    //   .get(`http://localhost:8000/users/${"1237489013471829304"}`)
    //   .then(async (response) => {
    //     // 2. Create user if user does not exist
    //     if (response.data == "") {
    //       console.log("user not found, creating user...");
    //       const { data } = await axios.post(`http://localhost:8000/users`, {
    //         walletAddress: "123478903214789014",
    //       });
    //       console.log(data);
    //       return data;
    //     } else {
    //       console.log("user found, returning user...");
    //       console.log(response.data);
    //       return response.data;
    //     }
    //   })
    //   .catch((err) => console.error(err));
    // 3. Create Project
    // const project = await axios
    //   .post("http://localhost:8000/projects", {
    //     ...data,
    //     acceptedCoins: [data.acceptedCoins],
    //     ownerAddress: userWallet?.publicKey.toString(),
    //     ownerId: String(user.id),
    //   })
    //   .then((response) => {
    //     console.log("project created!");
    //     console.log(response.data);
    //     return response.data;
    //   })
    //   .catch((err) => console.error(err));
    // 4. Connect to Solana
    // const program = new anchor.Program(idl, provider);
    // const [address] = anchor.web3.PublicKey.findProgramAddressSync(
    //   [provider.publicKey?.toBuffer()],
    //   program.programId
    // );
    // 5. Send transaction
    // TODO: Call createproject instruction onchain
    // 6. Completed
  };

  // PAGE TSX
  return (
    <>
      <main>
        <Card className="mx-auto overflow-hidden max-w-screen-lg flex justify-between">
          <div className="w-1/2">
            <img
              src={
                "https://img.freepik.com/free-vector/gradient-minimalist-background_23-2149989169.jpg?w=996&t=st=1713183462~exp=1713184062~hmac=bdb96914d64d00bc1ebe079132cad2cd9d17107401901cc96d41047a364ed73c"
              }
              className="h-full"
              alt="Gradient"
            />
          </div>

          <div className="w-1/2">
            <CardHeader>
              <CardTitle className="text-xl">Create Project</CardTitle>
              <CardDescription>
                Enter the following information to create a project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  className="grid gap-4"
                  onSubmit={form.handleSubmit(create)}
                >
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

                  <div className="grid gap-2 grid-cols-5">
                    <FormField
                      control={form.control}
                      name="targetAmount"
                      render={({ field, fieldState, formState }) => (
                        <FormItem className="col-span-3">
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
                        <FormItem className="col-span-2">
                          <FormLabel>Coin</FormLabel>
                          <Select onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a Coin" />
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
                  </div>

                  <FormField
                    control={form.control}
                    name="youtubeURL"
                    render={({ field, fieldState, formState }) => (
                      <FormItem>
                        <FormLabel>Youtube Link</FormLabel>
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

                  <Button type="submit" className="w-full">
                    Create
                  </Button>
                </form>
              </Form>
            </CardContent>
          </div>
        </Card>
      </main>
    </>
  );
};

export default CreateProject;
