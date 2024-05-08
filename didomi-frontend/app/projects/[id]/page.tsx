import {
  Bird,
  Book,
  Bot,
  Code2,
  CornerDownLeft,
  LifeBuoy,
  Mic,
  Paperclip,
  Rabbit,
  Settings,
  Settings2,
  Share,
  SquareTerminal,
  SquareUser,
  Triangle,
  Turtle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

import React from "react";
import axios from "axios";

const Project = async ({ params }: any) => {
  const project: any = await axios
    .get(`http://localhost:8000/projects/${params.id}`)
    .then((data) => {
      return data.data;
    })
    .catch(console.error);

  return (
    <TooltipProvider>
      <div className="grid h-full w-full">
        <div className="flex flex-col">
          <header className="sticky top-0 z-10 flex h-[53px] items-center gap-1 border-b bg-background px-4">
            <h1 className="text-4xl font-semibold">{project.title}</h1>
            <AlertDialog>
              <AlertDialogTrigger className="ml-auto ">
                <Button variant="outline" size="sm" className="gap-1.5 text-sm">
                  <Share className="size-3.5" />
                  Share
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction>Done</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </header>
          <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-4 lg:grid-cols-5">
            <div className="relative h-[350px] md:h-[450px] lg:h-full w-full flex flex-col rounded-xl bg-muted/50 p-4 col-span-full lg:col-span-3 overflow-hidden">
              <Image
                src={project.imageURL}
                alt={project.title}
                fill
                sizes={"100%"}
                style={{ objectFit: "cover" }}
              />
            </div>
            <div
              className="flex flex-row md:flex-col items-start gap-8 col-span-full lg:col-span-2"
              x-chunk="dashboard-03-chunk-0"
            >
              <div className="grid w-full items-start gap-6">
                <div className="grid gap-6 rounded-lg border p-4">
                  <div className="gap-2">
                    <span className="flex items-center justify-start">
                      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                        {project.currentAmount} {project.acceptedCoins[0]}
                      </h2>
                      <p className="leading-7 text-foreground ml-1">
                        raised of {project.targetAmount}{" "}
                        {project.acceptedCoins[0]} goal
                      </p>
                    </span>
                    <span className="flex flex-row md:flex-col gap-1">
                      <Progress value={33} />
                      <p className="leading-7 text-foreground md:ml-auto">
                        10K donations
                      </p>
                    </span>
                  </div>
                  <Button>Donate Now</Button>
                </div>
                <div className="grid gap-6 rounded-lg border p-4">
                  <legend className="-ml-1 px-1 text-sm font-medium">
                    Messages
                  </legend>
                  <div className="grid gap-3">
                    <Label htmlFor="role">Role</Label>
                    <Select defaultValue="system">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="system">System</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="assistant">Assistant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      placeholder="You are a..."
                      className="min-h-[9.5rem]"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full col-span-full lg:col-span-3 bg-background">
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                  <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{project.story}</p>
                </CardContent>
                <CardFooter>
                  <a href={project.websiteURL}>Click here to see more</a>
                </CardFooter>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};
export default Project;
