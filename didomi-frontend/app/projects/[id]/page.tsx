import { Link as LinkIcon, Gem, CircleDollarSign, User } from "lucide-react";
import Link from "next/link";
import { Share } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
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
import DonationDialog from "@/components/DonationDialog";

const Project = async ({ params }: any) => {
  const project: any = await axios
    .get(`http://localhost:8000/projects/${params.id}`)
    .then((data) => {
      return data.data;
    })
    .catch(console.error);

  return (
    <main className="h-screen overflow-scroll flex items-center justify-center">
      <TooltipProvider>
        <div className="grid h-full w-full ">
          <div className="flex flex-col">
            <header className="sticky top-0 flex z-10 mb-4 bg-muted h-20 w-full shrink-0 items-center justify-between border-b drop-shadow-lg">
              <div className="w-full z-10 px-4 md:px-8 flex container max-w-screen-md justify-between gap-8">
                <h1 className="text-4xl font-semibold">{project.title}</h1>
                <AlertDialog>
                  <AlertDialogTrigger className="ml-auto ">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-sm"
                    >
                      <Share className="size-3.5" />
                      Share
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogAction>Done</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </header>
            <section className="grid flex-1 gap-4 container max-w-screen-md p-4 md:grid-cols-4 ">
              <div className="relative h-[350px] md:h-[450px] w-full flex flex-col rounded-xl bg-muted/50 p-4 col-span-full overflow-hidden">
                <Image
                  src={project.imageURL}
                  alt={project.title}
                  fill
                  sizes={"100%"}
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div
                className="flex flex-row md:flex-col items-start gap-8 col-span-full"
                x-chunk="dashboard-03-chunk-0"
              >
                <section className="grid w-full items-start gap-6">
                  <div className="grid gap-6 rounded-lg border p-4">
                    <div className="gap-2">
                      <span className="flex items-center justify-start">
                        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                          {project.currentAmount} {project.acceptedCoins[0]}{" "}
                        </h2>
                        <p className="leading-7 text-muted-foreground ml-2">
                          raised of {project.targetAmount}{" "}
                          {project.acceptedCoins[0]} goal
                        </p>
                      </span>
                      <span className="flex flex-col gap-1">
                        <Progress
                          value={
                            (Number(project.currentAmount) /
                              Number(project.targetAmount)) *
                            100
                          }
                        />
                        <p className="leading-7 text-muted-foreground ml-auto">
                          10K donations
                        </p>
                      </span>
                    </div>
                    <DonationDialog project={project} />
                  </div>
                  {/* TODO: Display some stats for donations */}
                  <div className="grid gap-6 rounded-lg border p-4">
                    <div className="grid">
                      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        {project.totalDonations}
                      </h3>
                      <p className="leading-7">
                        People have donated to this project
                      </p>
                    </div>
                    <div className="grid gap-3">
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar>
                          <AvatarFallback>
                            <Gem />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col justify-between items-start">
                          <h4 className="scroll-m-20 text-lg font-semibold tracking-wide">
                            Mary Watkins
                          </h4>
                          <span className="flex justify-center items-center gap-3">
                            <p className="leading-7 font-semibold">12 SOL</p>
                            <p className="leading-7 font-bold">•</p>
                            <p className="leading-7">Top Donation</p>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar>
                          <AvatarFallback>
                            <CircleDollarSign />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col justify-between items-start">
                          <h4 className="scroll-m-20 text-lg font-semibold tracking-wide">
                            Anonymous
                          </h4>
                          <span className="flex justify-center items-center gap-3">
                            <p className="leading-7 font-semibold">0.856 SOL</p>
                            <p className="leading-7 font-bold">•</p>
                            <p className="leading-7">First Donation</p>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mb-4">
                        <Avatar>
                          <AvatarFallback>
                            <User />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col justify-between items-start">
                          <h4 className="scroll-m-20 text-lg font-semibold tracking-wide">
                            John Waters
                          </h4>
                          <span className="flex justify-center items-center gap-3">
                            <p className="leading-7 font-semibold">3.425 SOL</p>
                            <p className="leading-7 font-bold">•</p>
                            <p className="leading-7">Recent Donation</p>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
              <div className="w-full col-span-full bg-background">
                <Card>
                  <CardHeader>
                    <CardTitle>Story</CardTitle>
                    <CardDescription>
                      Read more about {project.title}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{project.story}</p>
                  </CardContent>
                  {project.websiteURL && (
                    <CardFooter className="bg-muted flex items-center justify-end pb-0 px-3">
                      <Link
                        href={project.websiteURL}
                        className="flex items-center md:gap-3 rounded-lg py-2 text-muted-foreground transition-all hover:text-primary"
                      >
                        <Button
                          variant={"outline"}
                          className="gap-1 flex items-center justify-center"
                        >
                          <LinkIcon className="h-4 w-4" />
                          Visit Website
                        </Button>
                      </Link>
                    </CardFooter>
                  )}
                </Card>
              </div>
            </section>
          </div>
        </div>
      </TooltipProvider>
    </main>
  );
};
export default Project;
