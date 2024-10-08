import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { MoreVertical, SquareArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Page } from "@/lib/enums";

const ProjectAnalytics = (props: {
  project: any;
  donations: any;
  deleteFunc: Function;
  setPage: Function;
}) => {
  return (
    // p-4 sm:px-6 sm:py-0
    <div className="flex-1 grid items-start gap-4 xl:grid-cols-3">
      <div>
        <Card className="overflow-hidden flex-1" x-chunk="dashboard-05-chunk-4">
          <div className="z-10 flex-1 relative aspect-square w-full max-h-64 overflow-hidden">
            <Image
              src={props.project.imageURL || "https://placehold.co/600x400"}
              alt="Project image"
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>
          <CardHeader className="flex flex-row items-center justify-center bg-muted/50">
            <div className="flex md:flex-col justify-between md:grid gap-0.5 px-5">
              <div className="grid gap-2 ml-4 md:ml-0 md:mt-4">
                <CardTitle className="h-fit capitalize text-center xl:text-left place-self-end md:place-self-center lg:place-self-start">
                  {props.project ? props.project.title : "An Error Occured"}
                </CardTitle>
                <CardDescription className="flex flex-col h-fit justify-center md:justify-between items-center gap-2">
                  <span>Date: {props.project.startDate.split("T")[0]}</span>
                  <div className="xl:ml-auto flex items-center gap-1">
                    <Link href={`/projects/${props.project.id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1"
                        title="Veiw"
                      >
                        <SquareArrowUpRight className="h-3.5 w-3.5" />
                        <span className="sr-only md:not-sr-only xl:whitespace-nowrap">
                          Veiw
                        </span>
                      </Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                        >
                          <MoreVertical className="h-3.5 w-3.5" />
                          <span className="sr-only">More</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Export</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Trash</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 text-sm">
            <div className="grid gap-3">
              <div className="font-semibold">Project Details</div>
              <ul className="grid gap-3">
                <li className="group flex items-center justify-between">
                  <span className="text-muted-foreground">Project ID</span>
                  <span className="">{props.project.id}</span>
                </li>
                <li className="group flex items-center justify-between">
                  <span className="text-muted-foreground">Project Address</span>
                  <span className="">
                    {props.project.accountAddress.substring(0, 17)}...
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Escrow Address</span>
                  <span>{props.project.escrowAddress.substring(0, 17)}...</span>
                </li>
              </ul>
              <Separator className="my-2" />
              <ul className="grid gap-3">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span>{props.project.category}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Accepted Token</span>
                  <span>{props.project.acceptedCoins}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span>{props.project.projectStatus}</span>
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
            <div className="text-xs text-muted-foreground">
              Updated <time dateTime="2023-11-23">November 23, 2023</time>
            </div>
          </CardFooter>
        </Card>
      </div>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 xl:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
            <CardHeader className="pb-3">
              <CardTitle>Your Project</CardTitle>
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                Welcome to your project Dashboard. Veiw contributions, analytics
                or Edit your project.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => props.setPage(Page.ProjectEdit)}>
                Edit Project
              </Button>
            </CardFooter>
          </Card>
          <Card x-chunk="dashboard-05-chunk-1">
            <CardHeader className="pb-2">
              <CardDescription>Amount Recieved</CardDescription>
              <CardTitle className="text-4xl">
                {props.project.currentAmount} {props.project.acceptedCoins[0]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                Current escrow amount
              </div>
            </CardContent>
            <CardFooter>
              <Progress value={25} aria-label="25% increase" />
            </CardFooter>
          </Card>
          <Card x-chunk="dashboard-05-chunk-2">
            <CardHeader className="pb-2">
              <CardDescription>Target Amount</CardDescription>
              <CardTitle className="text-4xl">
                {props.project.targetAmount} {props.project.acceptedCoins[0]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                +10% from last month
              </div>
            </CardContent>
            <CardFooter>
              <Progress value={12} aria-label="12% increase" />
            </CardFooter>
          </Card>
        </div>
        <Tabs defaultValue="contributions">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="contributions">Contributions</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="contributions">
            <Card x-chunk="dashboard-05-chunk-3">
              <CardHeader className="px-7">
                <CardTitle className="flex items-center">
                  <span>Your Contributions</span>
                  <Badge className="ml-auto">
                    {props.project.totalDonations} Total Donations
                  </Badge>
                </CardTitle>
                <CardDescription>
                  <span>Recent contributions to your project.</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hidden sm:table-cell">Id</TableHead>
                      <TableHead>Donor</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Token Type
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Date
                      </TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {props.donations.map((donation: any) => (
                      <TableRow className="bg-accent">
                        <TableCell className="hidden sm:table-cell">
                          <Badge className="text-xs" variant="secondary">
                            {donation.id}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">Annonymous</div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            {donation.donorAddress.substring(0, 20)}...
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {donation.tokenType}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {donation.date.split("T")[0]}
                        </TableCell>
                        <TableCell>{donation.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProjectAnalytics;
