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
import { ThemeProvider } from "@/providers/ThemeProvider";

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
          "min-h-screen -z-10 font-sans antialiased bg-background" +
          font.className
        }
      >
        <SolanaProviders>
          <NextAuthProvider>
            <DidomiProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
              >
                {children}
              </ThemeProvider>
            </DidomiProvider>
          </NextAuthProvider>
        </SolanaProviders>
        <Toaster />
      </body>
    </html>
  );
}
