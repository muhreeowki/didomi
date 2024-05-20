/* PROJECT DETAILS PAGE. VEIWED BY PROJECT CREATOR ONLY */
"use client";
import ProjectDashboard from "@/components/ProjectDashboard";

import axios from "axios";

import * as anchor from "@coral-xyz/anchor";
import * as walletAdapterReact from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import { DidomiProgram } from "../../../didomi-program/target/types/didomi_program";
import idl from "../../../didomi-program/target/idl/didomi_program.json";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import getDonations from "@/hooks/getDonations";
import getUserProjects from "@/hooks/getUserProjects";
import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardSidebar from "@/components/DashboardSidebar";

const ProjectDashboardPage = async ({}) => {
  // Solana State Config
  const wallet = walletAdapterReact.useWallet();
  if (!wallet.publicKey) {
    return <div>Connect Wallet to Continue</div>;
  }
  const userWallet = walletAdapterReact.useAnchorWallet();
  const { connection } = walletAdapterReact.useConnection();
  const programID = new web3.PublicKey(idl.address);
  // Session Data
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const router = useRouter();
  // Get Project and Donations from Backend
  const project: undefined | any = await getUserProjects(
    wallet.publicKey?.toString(),
  );
  if (!project) {
    router.push("/create");
    return;
  }
  const donations: any = await getDonations(project.id);
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
    <main className="md:h-screen md:overflow-hidden">
      <DashboardNavbar />
      <div className="w-full bg-background md:bg-gradient-to-r md:from-muted from-50% md:to-background md:to-50% md:overflow-hidden">
        <div className="container grid grid-cols-4 xl:grid-cols-6 px-0 md:overflow-hidden">
          <DashboardSidebar />
          <div className="w-full bg-background flex flex-col gap-4 p-4 col-span-full md:col-span-3 md:h-screen md:overflow-scroll xl:col-span-5 md:gap-4 lg:gap-6 md:p-6 md:pb-[120px]">
            <ProjectDashboard
              project={project}
              donations={donations}
              deleteFunc={handleDelete}
            />
          </div>
        </div>
      </div>
    </main>
  ) : (
    <div className="">Opps Not found</div>
  );
};

export default ProjectDashboardPage;
