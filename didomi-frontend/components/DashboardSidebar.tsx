import React from "react";
import Link from "next/link";
import { Home, LineChart, Package, ShoppingCart, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DashboardSidebar = () => {
  return (
    <aside className="border-r bg-muted col-span-full text-center pb-5 mb-5 md:col-span-1 md:mb-0 md:pb-0 md:text-left ">
      <div className="flex flex-col gap-6 px-3 lg:px-5">
        <h3 className="font-semibold tracking-tight text-3xl leading-5 mt-10">
          Dashboard
        </h3>
        <p className="text-base text-muted-foreground">
          One place to manage everything related to your Project.
        </p>
        <div className="flex-1 ">
          <nav className="flex justify-evenly items-center font-medium text-sm md:flex-col md:items-start md:text-md">
            <Link
              href="#"
              className="flex flex-col md:flex-row items-center gap-1 md:gap-3 rounded-lg py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="#"
              className="flex flex-col md:flex-row items-center gap-1 md:gap-3 rounded-lg py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <ShoppingCart className="h-4 w-4" />
              Orders
            </Link>
            <Link
              href="#"
              className="flex flex-col md:flex-row items-center gap-1 md:gap-3 rounded-lg bg-muted py-2 text-primary transition-all hover:text-primary"
            >
              <Package className="h-4 w-4" />
              Products
            </Link>
            <Link
              href="#"
              className="flex flex-col md:flex-row items-center gap-1 md:gap-3 rounded-lg py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Users className="h-4 w-4" />
              Customers
            </Link>
            <Link
              href="#"
              className="flex flex-col md:flex-row items-center gap-1 md:gap-3 rounded-lg py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <LineChart className="h-4 w-4" />
              Analytics
            </Link>
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
