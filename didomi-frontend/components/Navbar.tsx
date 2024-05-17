"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import logo from "../public/logoBlack.svg";
import Image from "next/image";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import SignInButton from "./SignInButton";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();
  return (
    <header className="sticky top-0 flex z-50 h-24 w-full p-6 shrink-0 items-center md:px-6 justify-between">
      <div className="w-full z-50 py-4 px-4 md:px-8 drop-shadow-2xl bg-gradient-to-b from-background/60 to-background/40  flex container justify-between gap-8 rounded-full backdrop-blur-sm">
        <Link className="flex items-center" href="/">
          <Image
            src={logo}
            alt="Logo"
            width={40}
            height={40}
            className="mr-2"
            style={{ color: "white" }}
          />
          <h1 className="font-bold tracking-wide text-2xl">DF</h1>
        </Link>
        <NavigationMenu className="ml-auto ">
          <NavigationMenuList className="gap-2">
            {session && (
              <NavigationMenuItem>
                <Link href="/dashboard" legacyBehavior passHref>
                  <NavigationMenuLink>
                    <Button
                      variant={"secondary"}
                      className="bg-transparent hover:bg-muted hidden md:block"
                    >
                      Dashboard
                    </Button>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
            <NavigationMenuItem>
              <div className="flex justify-evenly items-center">
                <SignInButton />
              </div>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};

export default Navbar;
