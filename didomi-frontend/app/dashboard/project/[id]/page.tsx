/* PROJECT DETAILS PAGE. VEIWED BY PROJECT CREATOR ONLY */
"use client";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { RedirectType, notFound, redirect } from "next/navigation";
import ProjectDashboard from "@/components/ProjectDashboard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import * as anchor from "@coral-xyz/anchor";
import * as walletAdapterReact from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import { DidomiProgram } from "../../../../../didomi-program/target/types/didomi_program";
import idl from "../../../../../didomi-program/target/idl/didomi_program.json";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import getProject from "@/hooks/getProject";
import getDonations from "@/hooks/getDonations";

const ProjectDashboardPage = async ({
  params,
}: {
  params: {
    id: any;
  };
}) => {
  // Solana State Config
  const wallet = walletAdapterReact.useWallet();
  const userWallet = walletAdapterReact.useAnchorWallet();
  const { connection } = walletAdapterReact.useConnection();
  const programID = new web3.PublicKey(idl.address);
  // Session Data
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const router = useRouter();
  // Get Project and Donations from Backend
  const project: any = await getProject(params.id);
  const donations: any = await getDonations(params.id);
  // Helper to get a provider to connect to the solana program
  const getProvider = () => {
    if (!userWallet) return null;
    return new anchor.AnchorProvider(connection, userWallet, {
      preflightCommitment: "processed",
    });
  };

  // Function to delete a project from backend and solana
  const handleDelete = async (id: string) => {
    // 1. Check that wallet is connected
    if (!wallet.connected || status !== "authenticated" || !wallet.publicKey) {
      return;
    }
    // 2. Connect to Solana Program
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
    // Solana Addresses
    const [projectAddress] = anchor.web3.PublicKey.findProgramAddressSync(
      [provider.publicKey?.toBuffer(), Buffer.from("coolproject")],
      program.programId,
    );
    const [escrowAddress] = anchor.web3.PublicKey.findProgramAddressSync(
      [provider.publicKey?.toBuffer(), projectAddress.toBuffer()],
      program.programId,
    );
    // Call delete instruction on Solana Program
    await program.methods
      .deleteProject()
      .accountsStrict({
        owner: wallet.publicKey,
        escrow: escrowAddress,
        project: projectAddress,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();
    // Delete project on Backend Server
    await axios.delete(`http://localhost:8000/projects/${id}`);
    console.log("archived");
    router.replace("/dashboard");
  };

  return project ? (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="top-0 hidden md:flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Current Project</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <ProjectDashboard
          project={project}
          donations={donations}
          deleteFunc={handleDelete}
        />
      </div>
    </div>
  ) : (
    <div className="">Opps Not found</div>
  );
};

export default ProjectDashboardPage;
