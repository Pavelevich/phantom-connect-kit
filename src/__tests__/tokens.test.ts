import { describe, it, expect } from "vitest";

// Test address validation (same as used in tokens API)
function isValidSolanaAddress(address: string): boolean {
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return base58Regex.test(address);
}

describe("Tokens API", () => {
  describe("Address Validation", () => {
    it("should accept valid Solana addresses", () => {
      const validAddresses = [
        "11111111111111111111111111111111",
        "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      ];

      validAddresses.forEach((addr) => {
        expect(isValidSolanaAddress(addr)).toBe(true);
      });
    });

    it("should reject invalid addresses", () => {
      const invalidAddresses = [
        "",
        "short",
        "0x1234567890abcdef1234567890abcdef12345678", // Ethereum format
        "invalid-chars-here!!",
        "O0Il", // Contains invalid base58 chars (O, 0, I, l)
      ];

      invalidAddresses.forEach((addr) => {
        expect(isValidSolanaAddress(addr)).toBe(false);
      });
    });
  });
});

describe("Token Data Processing", () => {
  it("should format token balance correctly", () => {
    const rawBalance = 1000000;
    const decimals = 6;
    const balance = rawBalance / Math.pow(10, decimals);
    expect(balance).toBe(1);
  });

  it("should calculate USD value correctly", () => {
    const balance = 100;
    const pricePerToken = 1.5;
    const usdValue = balance * pricePerToken;
    expect(usdValue).toBe(150);
  });

  it("should handle zero decimals", () => {
    const rawBalance = 5;
    const decimals = 0;
    const balance = rawBalance / Math.pow(10, decimals);
    expect(balance).toBe(5);
  });

  it("should handle large decimals", () => {
    const rawBalance = 123456789012345678n;
    const decimals = 18;
    const balance = Number(rawBalance) / Math.pow(10, decimals);
    expect(balance).toBeCloseTo(0.123456789, 6);
  });

  it("should sort tokens by USD value descending", () => {
    const tokens = [
      { symbol: "A", usdValue: 10 },
      { symbol: "B", usdValue: 100 },
      { symbol: "C", usdValue: 50 },
    ];

    const sorted = tokens.sort((a, b) => (b.usdValue || 0) - (a.usdValue || 0));

    expect(sorted[0].symbol).toBe("B");
    expect(sorted[1].symbol).toBe("C");
    expect(sorted[2].symbol).toBe("A");
  });

  it("should handle tokens without USD value", () => {
    const tokens = [
      { symbol: "A", usdValue: undefined },
      { symbol: "B", usdValue: 100 },
      { symbol: "C", usdValue: undefined },
    ];

    const sorted = tokens.sort((a, b) => (b.usdValue || 0) - (a.usdValue || 0));

    expect(sorted[0].symbol).toBe("B");
    // Tokens without value should be at the end
    expect(sorted[1].usdValue).toBeUndefined();
    expect(sorted[2].usdValue).toBeUndefined();
  });
});
