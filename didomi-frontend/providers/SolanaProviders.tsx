"use client";

import { useMemo } from "react";
import * as anchor from "@coral-xyz/anchor";
import * as walletAdapterReact from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import * as walletAdapterWallets from "@solana/wallet-adapter-wallets";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

export default function SolanaProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // SOLANA NETWORK CONFIG
  const solNetwork = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => anchor.web3.clusterApiUrl(solNetwork), []);
  const wallets = useMemo(
    () => [new walletAdapterWallets.PhantomWalletAdapter()],
    []
  );

  return (
    <>
      <walletAdapterReact.ConnectionProvider endpoint={endpoint}>
        <walletAdapterReact.WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>{children}</WalletModalProvider>
        </walletAdapterReact.WalletProvider>
      </walletAdapterReact.ConnectionProvider>
    </>
  );
}
