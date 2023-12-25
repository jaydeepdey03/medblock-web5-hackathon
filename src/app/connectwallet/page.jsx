"use client";

import {useConnect, useAccount, useNetwork} from "wagmi";
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {toast} from "@/components/ui/use-toast";
import {Button} from "@/components/ui/button";
import {ReloadIcon} from "@radix-ui/react-icons";

export default function ConnectWalletComponent() {
  const {isConnected} = useAccount();
  const {connect, connectors, error, isLoading, pendingConnector} =
    useConnect();
  const {chain} = useNetwork();
  const router = useRouter();
  //
  useEffect(() => {
    console.log(chain);

    if (isConnected && chain.id != "80001" && chain.id != "43113") {
      router.push("/switchnetwork");
    }
    if (chain && (chain.id == 80001 || chain.id == 43113) && isConnected) {
      router.push("/dashboard");
    }
  }, [isConnected, chain, router]);

  if (error) {
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description: "Couldn't Connect",
    });
  }

  //
  const connectWallet = async () => {
    try {
      connect({connector: connectors[0]});
      toast({
        title: "Connected!",
        description: "You are now connected to your wallet.",
      });
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Couldn't Connect",
      });
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center flex-col">
      {isLoading ? (
        <Button disabled>
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </Button>
      ) : (
        <Button onClick={connectWallet}>Connect Wallet</Button>
      )}
    </div>
  );
}
