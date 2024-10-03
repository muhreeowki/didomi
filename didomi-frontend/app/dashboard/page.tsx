/* PROJECT DETAILS PAGE. VEIWED BY PROJECT CREATOR ONLY */
"use client";
import ProjectDashboard from "@/components/ProjectDashboard";

import axios from "axios";

import * as anchor from "@coral-xyz/anchor";
import * as walletAdapterReact from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import { DidomiProgram } from "@/contract/didomi_program";
import idl from "@/contract/IDL.json";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import getDonations from "@/actions/getDonations";
import getUserProjects from "@/actions/getUserProjects";

const ProjectDashboardPage = async ({}) => {
  // Solana State Config
  const wallet = walletAdapterReact.useWallet();
  if (!wallet.publicKey) {
    return <div>Connect Wallet to Continue</div>;
  }
  const userWallet = walletAdapterReact.useAnchorWallet();
  const { connection } = walletAdapterReact.useConnection();
  // Session Data
  const { data: session, status } = useSession();
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
    if (
      !session ||
      !wallet.connected ||
      status !== "authenticated" ||
      !wallet.publicKey
    ) {
      return;
    }
    // 2. Connect to Solana Program
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
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`);
    console.log("archived");
    router.replace("/dashboard");
  };

  return project ? (
    <ProjectDashboard
      project={project}
      donations={donations}
      deleteFunc={handleDelete}
    />
  ) : (
    <div className="">Opps Not found</div>
  );
};

export default ProjectDashboardPage;
