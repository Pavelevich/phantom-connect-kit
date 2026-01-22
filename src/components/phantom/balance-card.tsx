"use client";

import { usePhantom } from "@phantom/react-sdk";
import { Skeleton } from "@/components/ui/skeleton";
import { useBalance } from "@/hooks/use-balance";

export function BalanceCard() {
  const { isConnected, addresses } = usePhantom();
  const solanaAddress = addresses?.find((a) => a.addressType === "Solana")?.address;
  const { balance, usdValue, isLoading, error, refetch } = useBalance(solanaAddress);

  if (!isConnected) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="p-5 bg-card border border-border rounded-lg">
        <Skeleton className="h-4 w-16 mb-3" />
        <Skeleton className="h-8 w-32" />
      </div>
    );
  }

  if (error) {
    const isConfigError = error.message === "RPC not configured";
    return (
      <div className="p-5 bg-card border border-border rounded-lg">
        <p className="text-xs text-muted-foreground mb-3">Balance</p>
        {isConfigError ? (
          <>
            <p className="text-sm text-muted-foreground mb-2">
              Configure Helius API key
            </p>
            <a
              href="https://www.helius.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline"
            >
              Get free key
            </a>
          </>
        ) : (
          <>
            <p className="text-sm text-destructive mb-2">Failed to load</p>
            <button
              onClick={refetch}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Retry
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="p-5 bg-card border border-border rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-muted-foreground">Balance</p>
        <button
          onClick={refetch}
          className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
        >
          Refresh
        </button>
      </div>
      <p className="text-2xl font-medium">
        {balance !== null ? balance.toFixed(4) : "0.0000"} <span className="text-muted-foreground">SOL</span>
      </p>
      {usdValue !== null && (
        <p className="text-xs text-muted-foreground mt-1">
          ${usdValue.toFixed(2)}
        </p>
      )}
    </div>
  );
}
