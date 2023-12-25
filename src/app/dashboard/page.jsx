"use client";

import {ModeToggle} from "@/components/Toggletheme";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {useAccount, useNetwork, useSwitchNetwork} from "wagmi";
import {disconnect} from "@wagmi/core";

import {toast} from "@/components/ui/use-toast";

export default function Dashboard() {
  const {isConnected, address} = useAccount();
  const {chain} = useNetwork();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const {chains, error, isLoading, pendingChainId, switchNetwork} =
    useSwitchNetwork();

  useEffect(() => {
    if (!isConnected) {
      router.push("/connectwallet");
    }

    if (isConnected && chain.id != 80001 && chain.id != 43113) {
      router.push("/switchnetwork");
    }
  }, [isConnected, chain, router]);

  const Disconnect = async () => {
    await disconnect();
    router.push("/connectwallet");
    toast({
      title: "Disconnected",
      description: "Wallet disconnected successfully",
    });
  };

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <div className="h-screen w-screen flex justify-center items-center flex-col">
      <div className="absolute top-5 right-10">
        <div className="flex space-x-5">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline">
                {address && address.slice(0, 5) + "...." + address.slice(-4)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  if (chain && chain.id === 43113) {
                    switchNetwork(80001);
                  } else if (chain && chain.id === 80001) {
                    switchNetwork(43113);
                  }
                }}
              >
                Switch to{" "}
                {chain && chain.id === 43113
                  ? "Mumbai"
                  : chain && chain.id === 80001 && "Avalanche"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={Disconnect}>
                <p className="text-red-400">Disconnect</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
        </div>
      </div>
      <div>{chain && chain.name}</div>
    </div>
  );
}
