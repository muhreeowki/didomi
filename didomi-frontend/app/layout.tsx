import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Button } from "@/components/ui/button";
import "@solana/wallet-adapter-react-ui/styles.css";
import { Toaster } from "@/components/ui/toaster";
import SolanaProviders from "../providers/SolanaProviders";
import { SessionProvider } from "next-auth/react";
import AppNavbar from "@/components/AppNavbar";
import NextAuthProvider from "@/providers/NextAuthProvider";

const font = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Didomi Fund",
  description: "Decentralized Crowd Funding Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={
          font.className + "min-h-screen font-sans antialiased bg-background"
        }
      >
        <SolanaProviders>
          <NextAuthProvider>
            <AppNavbar />
            <main className="mt-6 container realtive">{children}</main>
          </NextAuthProvider>
        </SolanaProviders>
        <Toaster />
      </body>
    </html>
  );
}
