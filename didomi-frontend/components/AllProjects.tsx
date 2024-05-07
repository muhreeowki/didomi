"use client";
import axios from "axios";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import getUserProjects from "@/hooks/getUserProjects";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

const AllProjects = async () => {
  const wallet = useAnchorWallet();
  const data = wallet
    ? await getUserProjects(wallet?.publicKey.toString())
    : null;

  return data ? (
    <section className="col-span-12 mt-14 grid grid-cols-8 gap-8 place-self-center">
      {data.map((item: any) => (
        <Link
          href={`/dashboard/project/${item.id}`}
          key={item.id}
          className="w-fit max-w-xs lg:max-w-lg col-span-4 transition-all scale-80 lg:scale-100 lg:hover:scale-95"
        >
          <Card>
            <CardContent className="flex flex-col lg:flex-row gap-2 items-center justify-between p-0 ">
              <div className="flex items-center justify-center w-full">
                <img
                  src={
                    item.imageURL ||
                    "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
                  }
                  alt="Photo by Drew Beamer"
                  className="aspect-square  w-full lg:max-w-[200px] rounded-md object-cover"
                />
              </div>
              <Card className="border-none w-full">
                <CardHeader className="p-4">
                  <CardTitle className="capitalize">
                    {item.title.length > 20
                      ? item.title.substring(0, 20) + "..."
                      : item.title}
                  </CardTitle>
                  <CardDescription>
                    {item.story.substring(0, 90) + "..."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-4 p-4 items-start justify-center">
                  <Progress value={33} />
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </Link>
      ))}
    </section>
  ) : (
    <div>ERROR</div>
  );
};

export default AllProjects;
