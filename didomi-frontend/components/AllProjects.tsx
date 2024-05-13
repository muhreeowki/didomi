"use client";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
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
  let totalProjects = 0;

  return (
    data && (
      <section className="col-span-12 mt-14 grid grid-cols-4 gap-8 place-self-center">
        {data.map((item: any) => {
          if (item.projectStatus == "OPEN") {
            totalProjects++;
            return (
              <Link
                href={`/dashboard/project/${item.id}`}
                key={item.id}
                className="w-full h-full max-w-xs lg:max-w-lg col-span-2 transition-all scale-80 lg:scale-100 lg:hover:scale-95"
              >
                <Card className="w-full h-full">
                  <CardContent className="w-full h-full flex flex-col lg:flex-row gap-2 items-center justify-between p-0 ">
                    <div className="relative w-full h-full aspect-square rounded-md items-center justify-center overflow-hidden">
                      <Image
                        src={
                          item.imageURL ||
                          "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
                        }
                        alt={item.title}
                        fill
                        style={{
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <Card className="border-none">
                      <CardHeader className="p-4">
                        <CardTitle className="capitalize">
                          {item.title.length > 20
                            ? item.title.substring(0, 17) + "..."
                            : item.title}
                        </CardTitle>
                        <CardDescription>
                          {item.story.substring(0, 87) + "..."}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="mt-4 p-4 items-start justify-center">
                        <Progress value={33} />
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </Link>
            );
          }
        })}
        {(!data || totalProjects < 1) && <h1>No Projects Available.</h1>}
      </section>
    )
  );
};

export default AllProjects;
