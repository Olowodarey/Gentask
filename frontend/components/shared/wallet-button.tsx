"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWallet } from "@/hooks/use-wallet";
import { formatAddress } from "@/lib/utils/format";
import { NETWORK_LABEL, type GenLayerNetwork } from "@/lib/genlayer/client";
import { Wallet, Copy, Check, LogOut } from "lucide-react";

export function WalletButton() {
  const { connected, address, balance, chainId, connect, disconnect, isConnecting } = useWallet();
  const [copied, setCopied] = useState(false);

  if (!connected || !address) {
    return (
      <Button onClick={connect} disabled={isConnecting}>
        <Wallet className="h-4 w-4 mr-2" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    );
  }

  const networkLabel = NETWORK_LABEL[chainId as GenLayerNetwork] ?? chainId;

  const copyAddress = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="font-mono gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden />
          {formatAddress(address)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Burner wallet</span>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
            {networkLabel}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-sm">
          <div className="text-muted-foreground text-xs">Balance</div>
          <div className="font-mono">{balance.toFixed(4)} GEN</div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={copyAddress}>
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2 text-green-500" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" /> Copy address
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={disconnect} className="text-destructive focus:text-destructive">
          <LogOut className="h-4 w-4 mr-2" /> Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
