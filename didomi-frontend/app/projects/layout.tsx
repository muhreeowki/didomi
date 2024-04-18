"use client";

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
  const endpoint = anchor.web3.clusterApiUrl("devnet");
  const wallets = [new walletAdapterWallets.PhantomWalletAdapter()];
  const { connection } = walletAdapterReact.useConnection();
  const userWallet = walletAdapterReact.useWallet();

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
