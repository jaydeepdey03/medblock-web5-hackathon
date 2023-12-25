"use client";

import {Button} from "@/components/ui/button";
import {useAccount, useConnect, useDisconnect} from "wagmi";
import {InjectedConnector} from "wagmi/connectors/injected";
import {useNetwork} from "wagmi";
import {useSwitchNetwork} from "wagmi";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {ReloadIcon} from "@radix-ui/react-icons";
import {toast} from "@/components/ui/use-toast";

export default function SwitchNetwork() {
  const [mounted, setMounted] = useState(false);
  const {isConnected} = useAccount();
  const {chain} = useNetwork();
  const {chains, error, isLoading, pendingChainId, switchNetwork} =
    useSwitchNetwork();
  const router = useRouter();

  useEffect(() => {
    if (!isConnected) {
      router.push("/connectwallet");
    }

    if (chain && (chain.id == 80001 || chain.id == 43113) && isConnected) {
      router.push("/dashboard");
    }

    console.log(chain);
  }, [isConnected, router, chain]);

  if (error) {
    toast({
      variant: "destructive",
      title: "Error in Connecting",
      description: error.message,
    });
  }
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <div className="flex justify-center items-center flex-col h-screen w-screen">
      <div className="flex flex-col space-y-3">
        {chains.map((network) => {
          if (isLoading && pendingChainId === network.id) {
            return (
              <Button disabled>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            );
          } else {
            return (
              <Button
                key={network.id}
                onClick={() => switchNetwork?.(network.id)}
              >
                Switch to {network.name}
                {isLoading && pendingChainId === network.id && " (switching)"}
              </Button>
            );
          }
        })}
        {/* <Button onClick={() => connect()}>SwitchNetwork</Button> */}
      </div>
    </div>
  );
}
