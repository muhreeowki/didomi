"use client";
import { Button } from "@/components/ui/button";
import * as React from "react";
import * as walletAdapterReact from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import { SigninMessage } from "@/utils/SigninMessage";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

import { useRouter } from "next/navigation";
import { useDidomiContext } from "@/context";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

const Home = () => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <main className="absolute top-0 left-0 h-screen w-screen">
      <BackgroundGradientAnimation>
        <div className="absolute z-30 inset-0 flex flex-col items-center justify-center lg:justify-end mb-[80px] text-white font-bold px-4 text-3xl  md:text-4xl lg:text-6xl text-center">
          <span className="pointer-events-none">
            <h1 className="scroll-m-20 text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20 text-6xl md:text-8xl font-semibold tracking-wider lg:text-[148px] bg-clip-text">
              DIDOMI FUND
            </h1>
            <p className="mt-6 bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20">
              The future of Crypto Crowdfunding and Charity
            </p>
          </span>
          <div className="w-full mt-8 flex justify-center items-end">
            <Button
              className="text-xl md:text-3xl p-4 md:p-8"
              size={"lg"}
              variant={"secondary"}
            >
              Get Started
            </Button>
          </div>
        </div>
      </BackgroundGradientAnimation>
    </main>
  );
};

export default Home;
