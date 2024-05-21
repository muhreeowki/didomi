import "@solana/wallet-adapter-react-ui/styles.css";
import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Suspense } from "react";
import Loading from "./loading";

export default function DashLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="md:h-screen md:overflow-hidden">
      <DashboardNavbar />
      <div className="w-full bg-background md:bg-gradient-to-r md:from-muted from-50% md:to-background md:to-50% md:overflow-hidden">
        <div className="container grid grid-cols-4 xl:grid-cols-6 px-0 md:overflow-hidden">
          <DashboardSidebar />
          <div className="w-full bg-background flex flex-col gap-4 p-4 col-span-full md:col-span-3 md:h-screen md:overflow-scroll xl:col-span-5 md:gap-4 lg:gap-6 md:p-6 md:pb-[120px]">
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
