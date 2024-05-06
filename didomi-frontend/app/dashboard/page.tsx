"use client";
import * as React from "react";
import * as walletAdapterReact from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import AllProjects from "@/components/AllProjects";
import Link from "next/link";

const UserDashboard = () => {
  const wallet = walletAdapterReact.useWallet();
  const walletModal = useWalletModal();
  const router = useRouter();

  const { data: session, status } = useSession();
  const loading = status === "loading";

  const handleSignOut = async () => {
    await signOut();
  };

  React.useEffect(() => {
    if (!wallet.connected && status != "loading") {
      handleSignOut().catch(console.error);
    }
  }, [wallet.connected]);

  return (
    <main className="grid grid-cols-12 justify-center">
      <section className="col-span-full flex justify-evenly items-center">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
          Your Projects
        </h1>
        <Link href={"/create"}>
          <Button>Create New Project</Button>
        </Link>
      </section>
      <AllProjects />
    </main>
  );
};

export default UserDashboard;
