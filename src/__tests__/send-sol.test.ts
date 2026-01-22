import { describe, it, expect } from "vitest";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

// Validation functions (same as used in SendSOL component)
function isValidSolanaAddress(address: string): boolean {
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return base58Regex.test(address);
}

const MIN_SOL_FOR_FEES = 0.001;
const MIN_SEND_AMOUNT = 0.000001;

function validateSendInputs(
  recipient: string,
  amount: string,
  senderAddress: string,
  balance: number
): string | null {
  if (!recipient.trim()) {
    return "Recipient address required";
  }
  if (!isValidSolanaAddress(recipient.trim())) {
    return "Invalid recipient address";
  }
  if (recipient.trim() === senderAddress) {
    return "Cannot send to yourself";
  }

  const amountNum = parseFloat(amount);
  const availableBalance = Math.max(0, balance - MIN_SOL_FOR_FEES);

  if (isNaN(amountNum) || amountNum <= 0) {
    return "Invalid amount";
  }
  if (amountNum > availableBalance) {
    return `Insufficient balance`;
  }
  if (amountNum < MIN_SEND_AMOUNT) {
    return "Amount too small";
  }

  return null;
}

describe("SendSOL Validation", () => {
  const senderAddress = "11111111111111111111111111111111";
  const validRecipient = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
  const balance = 1.0;

  describe("Recipient Validation", () => {
    it("should require recipient address", () => {
      const error = validateSendInputs("", "0.1", senderAddress, balance);
      expect(error).toBe("Recipient address required");
    });

    it("should reject invalid addresses", () => {
      const error = validateSendInputs("invalid", "0.1", senderAddress, balance);
      expect(error).toBe("Invalid recipient address");
    });

    it("should reject sending to self", () => {
      const error = validateSendInputs(senderAddress, "0.1", senderAddress, balance);
      expect(error).toBe("Cannot send to yourself");
    });

    it("should accept valid recipient", () => {
      const error = validateSendInputs(validRecipient, "0.1", senderAddress, balance);
      expect(error).toBeNull();
    });
  });

  describe("Amount Validation", () => {
    it("should reject empty amount", () => {
      const error = validateSendInputs(validRecipient, "", senderAddress, balance);
      expect(error).toBe("Invalid amount");
    });

    it("should reject zero amount", () => {
      const error = validateSendInputs(validRecipient, "0", senderAddress, balance);
      expect(error).toBe("Invalid amount");
    });

    it("should reject negative amount", () => {
      const error = validateSendInputs(validRecipient, "-1", senderAddress, balance);
      expect(error).toBe("Invalid amount");
    });

    it("should reject amount exceeding balance", () => {
      const error = validateSendInputs(validRecipient, "10", senderAddress, balance);
      expect(error).toBe("Insufficient balance");
    });

    it("should reject very small amounts", () => {
      const error = validateSendInputs(validRecipient, "0.0000001", senderAddress, balance);
      expect(error).toBe("Amount too small");
    });

    it("should accept valid amount", () => {
      const error = validateSendInputs(validRecipient, "0.5", senderAddress, balance);
      expect(error).toBeNull();
    });
  });

  describe("Balance Calculations", () => {
    it("should reserve minimum for fees", () => {
      const availableBalance = Math.max(0, balance - MIN_SOL_FOR_FEES);
      expect(availableBalance).toBe(0.999);
    });

    it("should handle zero balance", () => {
      const availableBalance = Math.max(0, 0 - MIN_SOL_FOR_FEES);
      expect(availableBalance).toBe(0);
    });

    it("should handle balance less than fee reserve", () => {
      const availableBalance = Math.max(0, 0.0005 - MIN_SOL_FOR_FEES);
      expect(availableBalance).toBe(0);
    });
  });

  describe("Lamports Conversion", () => {
    it("should convert SOL to lamports correctly", () => {
      const sol = 1.5;
      const lamports = Math.floor(sol * LAMPORTS_PER_SOL);
      expect(lamports).toBe(1500000000);
    });

    it("should handle small amounts", () => {
      const sol = 0.000001;
      const lamports = Math.floor(sol * LAMPORTS_PER_SOL);
      expect(lamports).toBe(1000);
    });

    it("should floor fractional lamports", () => {
      const sol = 0.0000015;
      const lamports = Math.floor(sol * LAMPORTS_PER_SOL);
      expect(lamports).toBe(1500);
    });
  });
});
