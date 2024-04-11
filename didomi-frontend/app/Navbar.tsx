import React from "react";
import { Button } from "@/components/ui/button";
import logo from "../public/logo.svg";
import Image from "next/image";

const Navbar = () => {
  return (
    <header className="container flex items-center justify-center">
      <nav className="mt-6 w-full flex flex-row justify-between items-center">
        <div className="flex flex-row justify-evenly items-center">
          <Image
            alt="Didomi Logo"
            src={logo}
            height={30}
            width={30}
            className="mr-1"
          />
          <h1 className="text-2xl font-bold">DF</h1>
        </div>
        <Button size={"sm"} className="font-bold rounded-full">
          Start Project
        </Button>
      </nav>
    </header>
  );
};

export default Navbar;
