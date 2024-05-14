import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Button } from "@/components/ui/button";
import "@solana/wallet-adapter-react-ui/styles.css";
import { Toaster } from "@/components/ui/toaster";
import SolanaProviders from "../providers/SolanaProviders";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";
import NextAuthProvider from "@/providers/NextAuthProvider";
import { DidomiProvider } from "@/context";

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
          font.className +
          "min-h-screen font-sans antialiased bg-muted/15 relative"
        }
      >
        <SolanaProviders>
          <NextAuthProvider>
            <DidomiProvider>
              <Navbar />
              <main className="w-full h-full container mt-4 px-4 md:px-6">
                {children}
              </main>
            </DidomiProvider>
          </NextAuthProvider>
        </SolanaProviders>
        <Toaster />
      </body>
    </html>
  );
}
