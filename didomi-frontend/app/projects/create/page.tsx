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
import { create } from "@/lib/formActions";
import { CreateProjectFormSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import * as anchor from "@coral-xyz/anchor";

const CreateProject = () => {
  // ZOD FORM CONFIG
  type Inputs = z.infer<typeof CreateProjectFormSchema>;
  const form = useForm<Inputs>({
    resolver: zodResolver(CreateProjectFormSchema),
    defaultValues: {
      title: "",
      story: "",
      imageOrYoutubeURL: "",
      acceptedCoin: "SOL",
      targetAmount: 0,
      category: "",
      ownerAddress: "",
      accountAddress: "",
    },
  });

  // TODO: Find Program
  // TODO: Figure out how to pass program and wallets to this function.

  // const accountAddress: anchor.web3.PublicKey = anchor.web3.PublicKey.findProgramAddressSync(seeds, programId)

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
                      name="category"
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
                              {tokens.map((category: string) => (
                                <SelectItem key={category} value={category}>
                                  {category}
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
                    name="imageOrYoutubeURL"
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
                  <input name="" type="text" hidden value={} />

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
