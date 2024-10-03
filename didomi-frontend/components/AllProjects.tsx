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
import getUserProjects from "@/actions/getUserProjects";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import ProjectThumbnail from "./ProjectThumbnail";

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
            return <ProjectThumbnail item={item} />;
          }
        })}
        {(!data || totalProjects < 1) && <h1>No Projects Available.</h1>}
      </section>
    )
  );
};

export default AllProjects;
