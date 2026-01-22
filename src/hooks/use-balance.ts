"use client";

import { useState, useEffect, useCallback } from "react";

interface UseBalanceReturn {
  balance: number | null;
  usdValue: number | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

// Validar formato de dirección Solana
function isValidSolanaAddress(address: string): boolean {
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return base58Regex.test(address);
}

export function useBalance(address: string | undefined): UseBalanceReturn {
  const [balance, setBalance] = useState<number | null>(null);
  const [usdValue, setUsdValue] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!address) {
      setBalance(null);
      setUsdValue(null);
      return;
    }

    // Validar address antes de hacer request
    if (!isValidSolanaAddress(address)) {
      setError(new Error("Invalid address format"));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Llamar a nuestra API route (key segura en servidor)
      const response = await fetch(`/api/balance?address=${address}`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch balance");
      }

      const data = await response.json();
      setBalance(data.balance);
      setUsdValue(data.usdValue);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch balance"));
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return {
    balance,
    usdValue,
    isLoading,
    error,
    refetch: fetchBalance,
  };
}
