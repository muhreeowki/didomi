"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import logo from "../public/logoWhite.svg";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  CollapsibleTrigger,
  CollapsibleContent,
  Collapsible,
} from "@/components/ui/collapsible";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import SignInButton from "./SignInButton";
import { useSession } from "next-auth/react";

const ReactUIWalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false },
);

const Navbar = () => {
  const { data: session } = useSession();
  return (
    <header className="sticky top-2 flex z-50 h-20 w-full p-6 shrink-0 items-center md:px-6 justify-between backdrop-blur-sm">
      <div className="w-full z-50 mt-6 py-4 px-8 drop-shadow-2xl bg-gradient-to-b from-background/60 to-background/40  flex container justify-between gap-8 rounded-full backdrop-blur-sm">
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
                      className="bg-transparent hover:bg-muted"
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
