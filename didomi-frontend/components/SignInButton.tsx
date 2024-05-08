"use client";
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { CircleUser, LogIn } from "lucide-react";
import { Button } from "./ui/button";
import * as walletAdapterReact from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import { SigninMessage } from "@/utils/SigninMessage";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { useDidomiContext } from "@/context";

const SignInButton = () => {
  const wallet = walletAdapterReact.useWallet();
  const walletModal = useWalletModal();
  const {
    csrf,
    setCsrf,
    loading,
    setLoading,
    signedIn,
    setSignedIn,
    signInWindowOpen,
    setSignInWindowOpen,
  } = useDidomiContext();

  const { data: session, status } = useSession();

  const handleConnectWallet = async () => {
    try {
      if (!wallet.connected) {
        walletModal.setVisible(true);
      }
      setCsrf(await getCsrfToken());
      return true;
    } catch (error) {
      console.error(error);
      return;
    }
  };

  const handleSignMessage = async () => {
    if (!wallet.publicKey || !csrf || !wallet.signMessage) return;
    try {
      const message = new SigninMessage({
        domain: window.location.host,
        publicKey: wallet.publicKey?.toBase58(),
        statement: `Sign this message to sign in to the app.`,
        nonce: csrf,
      });
      const data = new TextEncoder().encode(message.prepare());
      const signature = await wallet.signMessage(data).catch(console.error);
      if (!signature) {
        await handleSignOut();
        return;
      }
      const serializedSignature = bs58.encode(signature);
      await signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature: serializedSignature,
      });
      return true;
    } catch (error) {
      await handleSignOut();
    }
  };

  const handleSignOut = async () => {
    await wallet.disconnect();
    await signOut();
  };

  React.useEffect(() => {
    if (wallet.connected && !session && !signInWindowOpen) {
      setSignInWindowOpen(true);
    }
  }, [wallet.connected, session]);

  return (
    <>
      {session?.user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="mr-4">
              <CircleUser className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {!session && (
        <>
          <Button onClick={handleConnectWallet} className="mr-4">
            Connect Wallet
          </Button>
        </>
      )}
      <Dialog open={signInWindowOpen} onOpenChange={setSignInWindowOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Connect Wallet to Get Started</DialogTitle>
          </DialogHeader>
          <p className="leading-7 text-neutral-700">
            To finish connecting, you must sign a message in your wallet to
            verify that you are the owner of this account.
          </p>
          <DialogClose onClick={handleSignMessage}>
            <Button size={"lg"}>Sign Message</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SignInButton;
