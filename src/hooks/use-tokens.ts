"use client";

import { useState, useEffect, useCallback } from "react";

export interface Token {
  mint: string;
  symbol: string;
  name: string;
  balance: number;
  decimals: number;
  logo?: string;
  usdValue?: number;
}

interface UseTokensReturn {
  tokens: Token[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

// Validate Solana address format
function isValidSolanaAddress(address: string): boolean {
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return base58Regex.test(address);
}

export function useTokens(address: string | undefined): UseTokensReturn {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTokens = useCallback(async () => {
    if (!address) {
      setTokens([]);
      return;
    }

    if (!isValidSolanaAddress(address)) {
      setError(new Error("Invalid address format"));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/tokens?address=${address}`);

      // 503 = RPC not configured - not an error, just unavailable
      if (response.status === 503) {
        setTokens([]);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch tokens");
      }

      const data = await response.json();
      setTokens(data.tokens || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch tokens"));
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  return {
    tokens,
    isLoading,
    error,
    refetch: fetchTokens,
  };
}
