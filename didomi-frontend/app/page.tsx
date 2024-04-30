"use client";
import CallToAction from "@/components/CallToAction";
import Discover from "@/components/Discover";
import LandingNavbar from "@/components/LandingNavbar";
import { Button } from "@/components/ui/button";
import * as React from "react";
import * as walletAdapterReact from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import { SigninMessage } from "@/utils/SigninMessage";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
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
import { useRouter } from "next/navigation";

const Home = () => {
  const wallet = walletAdapterReact.useWallet();
  const walletModal = useWalletModal();
  const router = useRouter();

  const { data: session, status } = useSession();
  const loading = status === "loading";

  const [open, setOpen] = React.useState(false);
  const [csrf, setCsrf] = React.useState<string | undefined>("");

  const handleConnectWallet = async () => {
    console.log(status);
    try {
      if (!wallet.connected) {
        walletModal.setVisible(true);
      }

      setCsrf(await getCsrfToken());
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignMessage = async () => {
    if (!wallet.publicKey || !csrf || !wallet.signMessage) return;
    const message = new SigninMessage({
      domain: window.location.host,
      publicKey: wallet.publicKey?.toBase58(),
      statement: `Sign this message to sign in to the app.`,
      nonce: csrf,
    });

    const data = new TextEncoder().encode(message.prepare());
    const signature = await wallet.signMessage(data).catch(console.error);
    if (!signature) {
      await wallet.disconnect();
      return;
    }
    const serializedSignature = bs58.encode(signature);
    signIn("credentials", {
      message: JSON.stringify(message),
      redirect: false,
      signature: serializedSignature,
    });
    console.log(status);
  };

  React.useEffect(() => {
    if (wallet.connected && status === "unauthenticated") {
      setOpen(true);
    } else if (wallet.connected && status === "authenticated") {
      router.push("/dashboard");
    }
  }, [wallet.connected, status]);

  return (
    <>
      <main className="container realtive">
        <div className="mt-5 text-center">
          <h1 className="scroll-m-20 text-7xl md:text-8xl font-semibold tracking-wider lg:text-9xl ">
            DIDOMI FUND
          </h1>
          <p className="leading-7 tracking-wide mt-2 ml-1 font-medium md:text-lg text-md">
            The future of Crypto Crowdfunding and Charity
          </p>
        </div>
        <div className="w-full mt-8 flex justify-center items-center">
          <Dialog open={open} onOpenChange={setOpen}>
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
          <Button onClick={handleConnectWallet}>Get Started</Button>
        </div>
      </main>
    </>
  );
};

export default Home;
