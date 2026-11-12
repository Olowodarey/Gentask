"use client";

import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/use-wallet";
import { formatAddress } from "@/lib/utils/format";
import { Wallet } from "lucide-react";

export function WalletButton() {
  const { connected, address, connect, disconnect, isConnecting } = useWallet();

  if (connected && address) {
    return (
      <Button variant="outline" onClick={disconnect} className="font-mono">
        {formatAddress(address)}
      </Button>
    );
  }

  return (
    <Button onClick={connect} disabled={isConnecting}>
      <Wallet className="h-4 w-4 mr-2" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}
