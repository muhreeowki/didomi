"use client";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "@/components/ui/textarea";

import { tokens } from "@/lib/enums";

import { z } from "zod";
import { CreateDonationFormSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldName, FieldValue, SubmitHandler, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";

import * as anchor from "@coral-xyz/anchor";
import * as walletAdapterReact from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import { DidomiProgram } from "../../didomi-program/target/types/didomi_program";
import idl from "../../didomi-program/target/idl/didomi_program.json";
import { useToast } from "./ui/use-toast";
import SignInButton from "./SignInButton";
import axios from "axios";
import { HandCoins } from "lucide-react";

const DonationDialog = ({ project }: { project: any }) => {
  // ZOD FORM CONFIG
  type Inputs = z.infer<typeof CreateDonationFormSchema>;
  const form = useForm<Inputs>({
    resolver: zodResolver(CreateDonationFormSchema),
    defaultValues: {
      amount: 0,
      tokenType: "",
      message: "",
    },
  });

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

  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);
  const { toast } = useToast();

  //DONATION FUNCTION
  const donate = async (data: Inputs) => {
    setLoading(true);
    // setTimeout(() => {
    //   setLoading(false);
    // }, 5000);

    // 0. Check that wallet is connected
    if (!wallet.connected || status !== "authenticated" || !wallet.publicKey) {
      toast({
        title: "Connect Wallet to Continue",
        description: "You need your wallet to make the donation.",
      });
      setOpen(false);
      setLoading(false);
      return;
    }

    try {
      // 1. Connect to Solana
      const userPubKey = wallet.publicKey.toString();
      const provider = getProvider();
      if (!provider) {
        console.error("Provider is not available.");
        return;
      }
      const program = new anchor.Program<DidomiProgram>(
        idl as DidomiProgram,
        provider,
      );
      // Create Donation In Solana
      const tx = await program.methods
        .createDonation(
          new anchor.BN(data.amount * web3.LAMPORTS_PER_SOL),
          new anchor.BN(1),
        )
        .accountsStrict({
          donor: provider.publicKey,
          projectOwner: new web3.PublicKey(project.ownerAddress),
          projectAccount: new web3.PublicKey(project.accountAddress),
          projectEscrow: new web3.PublicKey(project.escrowAddress),
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();
      // Creat Donation in Backend
      await axios.post(`${process.NEXT_PUBLIC_API_URL}/donation`, {
        amount: data.amount,
        tokenType: "SOL",
        donorAddress: provider.publicKey.toString(),
        projectAddress: project.accountAddress,
        projectId: project.id,
        transactionHash: tx,
        message: data.message || "",
      });
      // Update the project Data
      setCompleted(true);
      console.log("Donated! Veiw Transaction here:");
      console.log(tx);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger className="w-full">
          <Button className="w-full gap-1">
            Donate Now
            <HandCoins />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="h-fit">
          <AlertDialogHeader>
            <AlertDialogDescription>Your are supporting</AlertDialogDescription>
            <AlertDialogTitle> {project.title}</AlertDialogTitle>
          </AlertDialogHeader>
          {loading && (
            <div className="w-full font-semibold text-3xl">
              <h1>Loading...</h1>
            </div>
          )}
          {!loading && !completed && (
            <Form {...form}>
              <form className="grid gap-6" onSubmit={form.handleSubmit(donate)}>
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field, fieldState, formState }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="text-2xl font-semibold"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tokenType"
                  render={({ field, fieldState, formState }) => (
                    <FormItem className="">
                      <FormLabel>Token</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              className="text-2xl font-semibold"
                              placeholder="Select a Token"
                            />
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
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field, fieldState, formState }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Leave a word of encouragement (optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-between mt-2">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button type="submit">Continue</Button>
                </div>
              </form>
            </Form>
          )}
          {!loading && completed && (
            <div className="w-full h-min-[100px]">
              <Card>
                <CardHeader>
                  <CardTitle>Donation Completed</CardTitle>
                  <CardDescription>
                    Your generous donation brings this vision one step closer to
                    reality - thank you for your invaluable support and
                    encouragement.{" "}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <svg
                    width="100"
                    height="100"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    color="green"
                  >
                    <path
                      d="M7.49991 0.877045C3.84222 0.877045 0.877075 3.84219 0.877075 7.49988C0.877075 11.1575 3.84222 14.1227 7.49991 14.1227C11.1576 14.1227 14.1227 11.1575 14.1227 7.49988C14.1227 3.84219 11.1576 0.877045 7.49991 0.877045ZM1.82708 7.49988C1.82708 4.36686 4.36689 1.82704 7.49991 1.82704C10.6329 1.82704 13.1727 4.36686 13.1727 7.49988C13.1727 10.6329 10.6329 13.1727 7.49991 13.1727C4.36689 13.1727 1.82708 10.6329 1.82708 7.49988ZM10.1589 5.53774C10.3178 5.31191 10.2636 5.00001 10.0378 4.84109C9.81194 4.68217 9.50004 4.73642 9.34112 4.96225L6.51977 8.97154L5.35681 7.78706C5.16334 7.59002 4.84677 7.58711 4.64973 7.78058C4.45268 7.97404 4.44978 8.29061 4.64325 8.48765L6.22658 10.1003C6.33054 10.2062 6.47617 10.2604 6.62407 10.2483C6.77197 10.2363 6.90686 10.1591 6.99226 10.0377L10.1589 5.53774Z"
                      fill="currentColor"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <AlertDialogCancel
                    onClick={() => {
                      setTimeout(() => setCompleted(false), 5);
                    }}
                  >
                    Done
                  </AlertDialogCancel>
                </CardFooter>
              </Card>
            </div>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default DonationDialog;
