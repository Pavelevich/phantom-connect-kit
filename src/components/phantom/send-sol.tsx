"use client";

import { useState } from "react";
import { usePhantom } from "@phantom/react-sdk";
import {
  Connection,
  Transaction,
  SystemProgram,
  PublicKey,
  LAMPORTS_PER_SOL,
  type TransactionSignature
} from "@solana/web3.js";
import { useBalance } from "@/hooks/use-balance";

interface SendSOLProps {
  onSuccess?: (signature: TransactionSignature) => void;
  onError?: (error: Error) => void;
  maxAmount?: number;
  className?: string;
}

type SendStatus = "idle" | "validating" | "signing" | "sending" | "success" | "error";

// Validate Solana address format
function isValidSolanaAddress(address: string): boolean {
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return base58Regex.test(address);
}

// Minimum SOL to keep for fees
const MIN_SOL_FOR_FEES = 0.001;

export function SendSOL({ onSuccess, onError, maxAmount, className }: SendSOLProps) {
  const { isConnected, addresses, solana } = usePhantom();
  const solanaAddress = addresses?.find((a) => a.addressType === "Solana")?.address;
  const { balance } = useBalance(solanaAddress);

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<SendStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [txSignature, setTxSignature] = useState<string | null>(null);

  if (!isConnected) {
    return null;
  }

  const availableBalance = balance !== null ? Math.max(0, balance - MIN_SOL_FOR_FEES) : 0;
  const effectiveMax = maxAmount ? Math.min(maxAmount, availableBalance) : availableBalance;

  const handleSetMax = () => {
    setAmount(effectiveMax.toFixed(6));
  };

  const validateInputs = (): string | null => {
    if (!recipient.trim()) {
      return "Recipient address required";
    }
    if (!isValidSolanaAddress(recipient.trim())) {
      return "Invalid recipient address";
    }
    if (recipient.trim() === solanaAddress) {
      return "Cannot send to yourself";
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return "Invalid amount";
    }
    if (amountNum > effectiveMax) {
      return `Insufficient balance (max: ${effectiveMax.toFixed(4)} SOL)`;
    }
    if (amountNum < 0.000001) {
      return "Amount too small (min: 0.000001 SOL)";
    }

    return null;
  };

  const handleSend = async () => {
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setStatus("validating");

    try {
      if (!solana || !solanaAddress) {
        throw new Error("Wallet not connected");
      }

      const heliusKey = process.env.NEXT_PUBLIC_HELIUS_RPC_KEY;
      const rpcUrl = heliusKey
        ? `https://mainnet.helius-rpc.com/?api-key=${heliusKey}`
        : "https://api.mainnet-beta.solana.com";

      const connection = new Connection(rpcUrl, "confirmed");
      const amountLamports = Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL);

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(solanaAddress),
          toPubkey: new PublicKey(recipient.trim()),
          lamports: amountLamports,
        })
      );

      // Get recent blockhash
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = new PublicKey(solanaAddress);

      setStatus("signing");

      // Sign with Phantom
      const signedTransaction = await solana.signTransaction(transaction);

      setStatus("sending");

      // Send transaction
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());

      // Confirm transaction
      await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      });

      setTxSignature(signature);
      setStatus("success");
      onSuccess?.(signature);

      // Reset form after success
      setTimeout(() => {
        setRecipient("");
        setAmount("");
        setStatus("idle");
        setTxSignature(null);
      }, 5000);

    } catch (err) {
      const error = err instanceof Error ? err : new Error("Transaction failed");
      setError(error.message);
      setStatus("error");
      onError?.(error);
    }
  };

  const isLoading = status === "validating" || status === "signing" || status === "sending";

  return (
    <div className={`p-5 bg-card border border-border rounded-lg ${className || ""}`}>
      <p className="text-xs text-muted-foreground mb-4">Send SOL</p>

      {status === "success" && txSignature ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">Transaction sent!</span>
          </div>
          <a
            href={`https://solscan.io/tx/${txSignature}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline block truncate"
          >
            View on Solscan →
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Recipient Input */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Recipient</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Solana address"
              disabled={isLoading}
              className="w-full h-9 px-3 rounded-md text-sm bg-background border border-border focus:border-primary focus:outline-none disabled:opacity-50 font-mono"
            />
          </div>

          {/* Amount Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-muted-foreground">Amount</label>
              <button
                onClick={handleSetMax}
                disabled={isLoading}
                className="text-xs text-primary hover:underline disabled:opacity-50"
              >
                Max: {effectiveMax.toFixed(4)} SOL
              </button>
            </div>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.001"
                min="0"
                disabled={isLoading}
                className="w-full h-9 px-3 pr-12 rounded-md text-sm bg-background border border-border focus:border-primary focus:outline-none disabled:opacity-50"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                SOL
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={isLoading || !recipient || !amount}
            className="w-full h-9 rounded-md text-sm font-medium bg-white text-black hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {status === "validating" && "Validating..."}
            {status === "signing" && "Confirm in wallet..."}
            {status === "sending" && "Sending..."}
            {(status === "idle" || status === "error") && "Send SOL"}
          </button>

          {/* Fee Notice */}
          <p className="text-[10px] text-muted-foreground text-center">
            Network fee: ~0.000005 SOL
          </p>
        </div>
      )}
    </div>
  );
}
