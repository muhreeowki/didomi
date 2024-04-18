"use client";
import { Button } from "@/components/ui/button";
import logo from "../public/logo.svg";
import Image from "next/image";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const ProjectsNavbar = () => {
  return (
    <header className="container flex items-center justify-center">
      <NavigationMenu className="mt-6 flex flex-row justify-between items-center">
        <Link href={"/"}>
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
        </Link>
        <NavigationMenuList className="flex flex-row justify-evenly items-center">
          <NavigationMenuItem>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <h1 className="text-lg font-medium">Link</h1>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href={"/projects/create"}>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <h1 className="text-lg font-medium">Start Project</h1>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
        <WalletMultiButton />
      </NavigationMenu>
    </header>
  );
};

export default ProjectsNavbar;
