import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Upload,
  Users2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { ContainerIcon } from "lucide-react";

import { z } from "zod";
import { Page, categories, tokens, projectStatus } from "@/lib/enums";
import { UpdateProjectFormSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import * as React from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { DidomiProgram } from "../../didomi-program/target/types/didomi_program";
import idl from "../../didomi-program/target/idl/didomi_program.json";
import * as web3 from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import * as walletAdapterReact from "@solana/wallet-adapter-react";

const ProjectEditPage = (props: {
  project: any;
  deleteFunc: Function;
  setPage: Function;
}) => {
  // Router
  const router = useRouter();

  // ZOD CONFIG
  type Inputs = z.infer<typeof UpdateProjectFormSchema>;
  const form = useForm<Inputs>({
    resolver: zodResolver(UpdateProjectFormSchema),
    defaultValues: {
      title: props.project.title,
      story: props.project.story,
      imageURL: props.project.imageURL,
      acceptedCoins: props.project.acceptedCoins[0],
      targetAmount: props.project.targetAmount,
      category: props.project.category,
      projectStatus: props.project.projectStatus,
    },
  });

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

  // Session State
  const { data: session, status } = useSession();
  const loading = status === "loading";

  // Main Update Function
  const update = async (data: Inputs) => {
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
    // 3. Update Project On Backend Server
    const project = await axios
      .patch(`${"http://localhost:8000"}/projects/${props.project.id}`, {
        ...data,
        acceptedCoins: [data.acceptedCoins],
      })
      .then((response) => {
        return response.data;
      })
      .catch((err) => console.error(err));

    if (!project) {
      console.error("Unable to Update Project.");
      return;
    }

    // 4. Update Project on Solana if user changed any core data.
    try {
      // Converting String to type [u8: 64] in Rust
      const encoder = new TextEncoder();
      const titleBytes = encoder.encode(data.title as string);
      const projectTitle = new Uint8Array(64);
      projectTitle.set(titleBytes, 0);
      for (let i: number = titleBytes.length; i < 64; i++) {
        projectTitle[i] = 0;
      }
      const tx = await program.methods
        .updateProject(
          Array.from(projectTitle),
          new anchor.BN(data.targetAmount),
        )
        .accountsStrict({
          owner: userWallet?.publicKey,
          project: projectAddress,
          escrow: escrowAddress,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();
      // 6. Completed
      console.log("Updated Project:");
      console.log(project);
      console.log("Transaction Hash");
      console.log(tx);
      router.push(`/projects/${project.id}`);
    } catch (error) {
      if (project) {
        await axios
          .patch(`${"http://localhost:8000"}/projects/${props.project.id}`, {
            ...project,
          })
          .then((response) => {
            return response.data;
          })
          .catch((err) => console.error(err));
      }
      console.error(error);
      return;
    }
  };

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(update)}
          className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => props.setPage(Page.ProjectAnalytics)}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Edit Project
            </h1>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button variant="outline" type="reset" size="sm">
                Discard
              </Button>
              <Button type="submit" size="sm">
                Save Project
              </Button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-0">
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                  <CardDescription>
                    Write something descriptive and captivating for your
                    prospective contributors.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field, fieldState, formState }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              id="title"
                              type="text"
                              className="w-full"
                              defaultValue={props.project.title}
                              {...field}
                            />
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
                              id="description"
                              defaultValue={props.project.story}
                              className="min-h-32"
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
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={props.project.category}
                          >
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
                  </div>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-07-chunk-1">
                <CardHeader>
                  <CardTitle>Contributions</CardTitle>
                  <CardDescription>
                    Manage contribution settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 grid-cols-5">
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
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={props.project.acceptedCoins[0]}
                          >
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
                </CardContent>
              </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-3">
                <CardHeader>
                  <CardTitle>Project Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="projectStatus"
                      render={({ field, fieldState, formState }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={props.project.projectStatus}
                            disabled
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {projectStatus.map(
                                (status: string, i: number) => (
                                  <SelectItem key={i} value={status}>
                                    {status}
                                  </SelectItem>
                                ),
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
                <CardHeader>
                  <CardTitle>Project Image</CardTitle>
                  <CardDescription>
                    Select a beautiful captivating image.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <img
                      alt="Project image"
                      className="aspect-square w-full rounded-md object-cover"
                      height="300"
                      src={
                        props.project.imageURL || "https://placehold.co/600x400"
                      }
                      width="300"
                    />
                    <FormField
                      control={form.control}
                      name="imageURL"
                      render={({ field, fieldState, formState }) => (
                        <FormItem>
                          <FormLabel>Image</FormLabel>
                          <FormControl>
                            <Input
                              id="image"
                              type="url"
                              className="w-full"
                              defaultValue={props.project.imageURL}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-07-chunk-5">
                <CardHeader>
                  <CardTitle>Archive Project</CardTitle>
                  <CardDescription>
                    The project will be archived and donors will not be able to
                    access it. The link for this project will no longer work,
                    and you will not be able to access this project.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-right">
                  <div></div>
                  <Button
                    size="sm"
                    variant="destructive"
                    className=""
                    type="button"
                    onClick={async () => {
                      await props.deleteFunc(props.project.id);
                      router.replace("/dashboard");
                    }}
                  >
                    Archive Project
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 md:hidden">
            <Button variant="outline" type="reset" size="sm">
              Discard
            </Button>
            <Button type="submit" size="sm">
              Save Project
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
};
export default ProjectEditPage;
