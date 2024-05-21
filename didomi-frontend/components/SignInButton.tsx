"use client";
import * as React from "react";
import { Oval } from "react-loader-spinner";
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
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import Link from "next/link";
import { CheckCheck, CircleUser, Ban } from "lucide-react";
import { Button } from "./ui/button";
import * as walletAdapterReact from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import { SigninMessage } from "@/utils/SigninMessage";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { useDidomiContext } from "@/context";
import { DialogDescription } from "@radix-ui/react-dialog";

const SignInButton = () => {
  const wallet = walletAdapterReact.useWallet();
  const walletModal = useWalletModal();
  const [connectError, setConnectError] = React.useState<string | undefined>(
    undefined,
  );
  const {
    csrf,
    setCsrf,
    loading,
    setLoading,
    signInWindowOpen,
    setSignInWindowOpen,
  } = useDidomiContext();

  const { data: session, status } = useSession();

  const handleConnectWallet = async () => {
    try {
      if (!wallet.connect || !session) {
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
    if (!wallet.publicKey || !csrf || !wallet.signMessage) {
      return;
    }
    setLoading(true);
    try {
      const message = new SigninMessage({
        domain: window.location.host,
        publicKey: wallet.publicKey?.toBase58(),
        statement: `Sign this message to sign in to the app.`,
        nonce: csrf,
      });
      const data = new TextEncoder().encode(message.prepare());
      const signature = await wallet.signMessage(data).catch((e) => {
        setConnectError(e.message);
        setLoading(false);
      });
      if (!signature) {
        await handleSignOut(false);
        return;
      }
      const serializedSignature = bs58.encode(signature);
      await signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature: serializedSignature,
      });
      // setTimeout(() => {
      setLoading(false);
      // }, 1500);
      return true;
    } catch (e) {
      setConnectError((e as Error).message);
      setLoading(false);
    }
  };

  const handleSignOut = async (redirect: boolean) => {
    await wallet.disconnect();
    await signOut({ redirect });
    setCsrf(undefined);
  };

  React.useEffect(() => {
    if (
      wallet.connected &&
      !session &&
      status != "loading" &&
      !signInWindowOpen
    ) {
      setSignInWindowOpen(true);
    }
    if (!wallet.connected && session) {
      handleSignOut(true);
    }
  }, [wallet.connected, session]);

  return (
    <>
      {session?.user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1">
              <CircleUser className="h-6 w-6" />
              <span>{wallet.publicKey?.toString().substring(0, 6)}...</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={"/dashboard"}>Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={"mailto:muriuki@muchiri.com"}>Support</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleSignOut(true)}>
              Logout
            </DropdownMenuItem>
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
        {!loading && !connectError && !session && (
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader className="text-center">
              <DialogTitle>Connect Wallet to Get Started</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              To finish connecting, you must sign a message in your wallet to
              verify that you are the owner of this account.
            </DialogDescription>
            <Button size={"lg"} onClick={handleSignMessage}>
              Sign Message
            </Button>
          </DialogContent>
        )}
        {loading && (
          <DialogContent className="sm:max-w-[425px]">
            <div className="w-full flex items-center justify-center">
              <Oval
                visible={true}
                height="40"
                width="40"
                color="hsla(0,0%,30%,1) "
                secondaryColor="hsla(0,0%,70%,1)"
                strokeWidth={5}
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </div>
          </DialogContent>
        )}
        {!loading && !connectError && session && wallet.connected && (
          <DialogContent>
            <DialogHeader></DialogHeader>
            <div className="flex flex-col items-center justify-center gap-1">
              <CheckCheck className="w-20 h-20" color="green" />
              <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                Wallet Connected Successfully
              </h2>
            </div>
            <DialogClose className="w-full justify-end">
              <Button size={"lg"}>Continue</Button>
            </DialogClose>
          </DialogContent>
        )}
        {!loading && connectError && (
          <DialogContent>
            <div className="flex flex-col items-center justify-center gap-1">
              <Ban className="w-20 h-20" color="red" />
              <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                Failed to Connect Wallet
              </h2>
              <p className="leading-7 text-muted-foreground">{connectError}</p>
            </div>
            <DialogClose className="w-full justify-end">
              <Button
                size={"lg"}
                onClick={async () => {
                  setConnectError(undefined);
                  await wallet.disconnect();
                  await handleConnectWallet();
                }}
              >
                Try Again
              </Button>
            </DialogClose>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default SignInButton;
