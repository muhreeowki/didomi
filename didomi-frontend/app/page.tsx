"use client";
import CallToAction from "@/components/CallToAction";
import Discover from "@/components/Discover";
import { Button } from "@/components/ui/button";
import * as React from "react";
import * as walletAdapterReact from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import { SigninMessage } from "@/utils/SigninMessage";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

import { useRouter } from "next/navigation";

const Home = () => {
  return (
    <>
      <main className="container realtive">
        <div className="mt-5 text-center">
          <h1 className="scroll-m-20 text-7xl md:text-8xl font-semibold tracking-wider lg:text-9xl ">
            DIDOMI FUND
          </h1>
          <p className="leading-7 tracking-wide mt-2 ml-1 font-medium md:text-lg text-md">
            The future of Crypto Crowdfunding and Charity
          </p>
        </div>
        <div className="w-full mt-8 flex justify-center items-center">
          <Button>Get Started</Button>
        </div>
      </main>
    </>
  );
};

export default Home;
