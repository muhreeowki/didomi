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

const DashboardNavbar = () => {
  const { data: session } = useSession();
  return (
    <header className="flex z-10 bg-muted h-24 w-full shrink-0 items-center justify-between border-b drop-shadow-lg">
      <div className="w-full z-10 py-4 px-4 md:px-8 flex container justify-between gap-8">
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
                      className="hidden md:block bg-transparent hover:bg-muted"
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

export default DashboardNavbar;
