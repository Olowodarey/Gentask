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
import { useMounted } from "@/hooks/use-mounted";
import { formatAddress } from "@/lib/utils/format";
import { NETWORK_LABEL, type GenLayerNetwork } from "@/lib/genlayer/client";
import { Wallet, Copy, Check, LogOut, Loader2 } from "lucide-react";

export function WalletButton() {
  const {
    connected,
    address,
    balance,
    chainId,
    mode,
    hasMetaMask,
    connect,
    connectMetaMask,
    connectBurner,
    disconnect,
    isConnecting,
  } = useWallet();
  const mounted = useMounted();
  const [copied, setCopied] = useState(false);

  // Disconnected
  if (!connected || !address) {
    // Before mount we can't know if MetaMask is present; render a stable button.
    if (!mounted || !hasMetaMask) {
      return (
        <Button onClick={connect} disabled={isConnecting}>
          {isConnecting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Wallet className="h-4 w-4 mr-2" />
          )}
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      );
    }
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button disabled={isConnecting}>
            {isConnecting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Wallet className="h-4 w-4 mr-2" />
            )}
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuItem onClick={connectMetaMask}>
            <Wallet className="h-4 w-4 mr-2 text-primary" /> MetaMask
          </DropdownMenuItem>
          <DropdownMenuItem onClick={connectBurner}>
            <Wallet className="h-4 w-4 mr-2" /> Burner wallet
            <span className="ml-auto text-[10px] text-muted-foreground">no setup</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const networkLabel = NETWORK_LABEL[chainId as GenLayerNetwork] ?? chainId;
  const modeLabel = mode === "metamask" ? "MetaMask" : "Burner wallet";

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
          <span>{modeLabel}</span>
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
        {mode === "burner" && mounted && hasMetaMask && (
          <DropdownMenuItem onClick={connectMetaMask}>
            <Wallet className="h-4 w-4 mr-2 text-primary" /> Switch to MetaMask
          </DropdownMenuItem>
        )}
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
