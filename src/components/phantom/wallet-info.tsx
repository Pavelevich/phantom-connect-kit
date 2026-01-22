"use client";

import { usePhantom, useDisconnect } from "@phantom/react-sdk";
import { Skeleton } from "@/components/ui/skeleton";

interface WalletInfoProps {
  showDisconnect?: boolean;
}

export function WalletInfo({ showDisconnect = true }: WalletInfoProps) {
  const { isConnected, addresses, isLoading } = usePhantom();
  const { disconnect } = useDisconnect();

  const solanaAddress = addresses?.find((a) => a.addressType === "Solana")?.address;

  if (isLoading) {
    return (
      <div className="p-5 bg-card border border-border rounded-lg">
        <Skeleton className="h-4 w-24 mb-3" />
        <Skeleton className="h-5 w-48" />
      </div>
    );
  }

  if (!isConnected || !solanaAddress) {
    return null;
  }

  const truncated = `${solanaAddress.slice(0, 12)}...${solanaAddress.slice(-12)}`;

  return (
    <div className="p-5 bg-card border border-border rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-muted-foreground">Wallet</p>
        <span className="text-[10px] text-green-500 font-medium">Connected</span>
      </div>
      <p className="font-mono text-sm mb-3">{truncated}</p>
      <div className="flex gap-2">
        <button
          onClick={() => navigator.clipboard.writeText(solanaAddress)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Copy
        </button>
        {showDisconnect && (
          <button
            onClick={() => disconnect()}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Disconnect
          </button>
        )}
      </div>
    </div>
  );
}
