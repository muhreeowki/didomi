"use client";

import { useMemo } from "react";
import ProjectsNavbar from "@/components/ProjectsNavbar";
import * as anchor from "@coral-xyz/anchor";
import * as walletAdapterReact from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import * as walletAdapterWallets from "@solana/wallet-adapter-wallets";

export default function ProjectLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // SOLANA WALLET CONFIG
  const solNetwork = "devnet";
  const endpoint = useMemo(() => anchor.web3.clusterApiUrl(solNetwork), []);
  const wallets = useMemo(
    () => [new walletAdapterWallets.PhantomWalletAdapter()],
    []
  );

  return (
    <>
      <walletAdapterReact.ConnectionProvider endpoint={endpoint}>
        <walletAdapterReact.WalletProvider wallets={wallets}>
          <WalletModalProvider>
            <ProjectsNavbar />
            <main className="mt-6 container realtive">{children}</main>
          </WalletModalProvider>
        </walletAdapterReact.WalletProvider>
      </walletAdapterReact.ConnectionProvider>
    </>
  );
}
