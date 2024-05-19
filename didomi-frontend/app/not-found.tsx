"use client";
import { Button } from "@/components/ui/button";
import * as React from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

const notFound = () => {
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
        <div className="absolute z-30 inset-0 flex flex-col items-center justify-center text-white font-bold px-4 text-2xl  md:text-3xl lg:text-4xl text-center">
          <span className="pointer-events-none">
            <h1 className="scroll-m-20 text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/40 text-6xl md:text-8xl font-semibold tracking-wider lg:text-[148px] bg-clip-text">
              OOPS!
            </h1>
            <p className="mt-6 bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/40">
              404: The requested page is not available
            </p>
          </span>
          <div className="w-full mt-8 flex justify-center items-end">
            <Link href={"/"}>
              <Button
                className="text-md md:text-xl p-2 md:p-4"
                size={"sm"}
                variant={"default"}
              >
                Go Back Home
              </Button>
            </Link>
          </div>
        </div>
        {/*</BackgroundGradientAnimation>*/}
      </main>
    </>
  );
};

export default notFound;
