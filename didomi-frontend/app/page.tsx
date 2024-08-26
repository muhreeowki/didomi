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
import Navbar from "@/components/Navbar";

const Home = () => {
  const router = useRouter();
  const { data: session } = useSession();
  return (
    <>
      <Navbar />
      <main
        className="absolute top-0 left-0 h-screen w-screen"
        style={{
          backgroundColor: "hsla(0,100%,50%,1)",
          backgroundImage:
            "radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(340,100%,76%,1) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(22,100%,77%,1) 0px, transparent 50%), radial-gradient(at 80% 100%, hsla(242,100%,70%,1) 0px, transparent 50%), radial-gradient(at 0% 0%, hsla(343,100%,76%,1) 0px, transparent 50%)",
        }}
      >
        {/*<BackgroundGradientAnimation>*/}
        <div className="absolute z-30 inset-0 flex flex-col items-center justify-center text-white font-bold px-4 text-3xl  md:text-4xl lg:text-5xl text-center">
          <span className="pointer-events-none">
            <h1 className="scroll-m-20 text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/40 text-6xl md:text-8xl font-semibold tracking-wider lg:text-[148px] bg-clip-text">
              Didomi Fund
            </h1>
            <p className="mt-6 bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/40">
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
        {/*</BackgroundGradientAnimation>*/}
      </main>
    </>
  );
};

export default Home;
