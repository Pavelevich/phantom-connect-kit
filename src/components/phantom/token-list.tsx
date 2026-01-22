"use client";

import { usePhantom } from "@phantom/react-sdk";
import { Skeleton } from "@/components/ui/skeleton";
import { useTokens, Token } from "@/hooks/use-tokens";

interface TokenListProps {
  maxItems?: number;
  className?: string;
}

export function TokenList({ maxItems, className }: TokenListProps) {
  const { isConnected, addresses } = usePhantom();
  const solanaAddress = addresses?.find((a) => a.addressType === "Solana")?.address;
  const { tokens, isLoading, error, refetch } = useTokens(solanaAddress);

  if (!isConnected) {
    return null;
  }

  if (isLoading) {
    return (
      <div className={`p-5 bg-card border border-border rounded-lg ${className || ""}`}>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // No Helius key configured
  if (!isLoading && tokens.length === 0 && !error) {
    return (
      <div className={`p-5 bg-card border border-border rounded-lg ${className || ""}`}>
        <p className="text-xs text-muted-foreground mb-3">Tokens</p>
        <p className="text-sm text-muted-foreground mb-2">
          Add HELIUS_API_KEY to .env.local
        </p>
        <a
          href="https://www.helius.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline"
        >
          Get free key
        </a>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-5 bg-card border border-border rounded-lg ${className || ""}`}>
        <p className="text-xs text-muted-foreground mb-3">Tokens</p>
        <p className="text-sm text-destructive mb-2">Failed to load</p>
        <button
          onClick={refetch}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const displayTokens = maxItems ? tokens.slice(0, maxItems) : tokens;

  return (
    <div className={`p-5 bg-card border border-border rounded-lg ${className || ""}`}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-muted-foreground">Tokens ({tokens.length})</p>
        <button
          onClick={refetch}
          className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
        >
          Refresh
        </button>
      </div>

      {displayTokens.length === 0 ? (
        <p className="text-sm text-muted-foreground">No tokens found</p>
      ) : (
        <div className="space-y-3">
          {displayTokens.map((token) => (
            <TokenRow key={token.mint} token={token} />
          ))}
          {maxItems && tokens.length > maxItems && (
            <p className="text-xs text-muted-foreground text-center pt-2">
              +{tokens.length - maxItems} more tokens
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function TokenRow({ token }: { token: Token }) {
  const copyMint = () => {
    navigator.clipboard.writeText(token.mint);
  };

  return (
    <div
      className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 -mx-2 px-2 py-1 rounded transition-colors"
      onClick={copyMint}
      title="Click to copy mint address"
    >
      {token.logo ? (
        <img
          src={token.logo}
          alt={token.symbol}
          className="w-8 h-8 rounded-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
          {token.symbol.slice(0, 2)}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{token.symbol}</p>
        <p className="text-xs text-muted-foreground truncate">{token.name}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium">
          {token.balance < 0.0001
            ? token.balance.toExponential(2)
            : token.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })}
        </p>
        {token.usdValue !== undefined && (
          <p className="text-xs text-muted-foreground">
            ${token.usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        )}
      </div>
    </div>
  );
}
