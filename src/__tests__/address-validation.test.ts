import { describe, it, expect } from "vitest";

// Validar formato de dirección Solana (base58, 32-44 chars)
function isValidSolanaAddress(address: string): boolean {
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return base58Regex.test(address);
}

describe("Solana Address Validation", () => {
  it("should accept valid Solana addresses", () => {
    const validAddresses = [
      "11111111111111111111111111111111", // 32 chars
      "So11111111111111111111111111111111111111112", // SOL mint
      "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
      "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj", // Random valid
    ];

    validAddresses.forEach((addr) => {
      expect(isValidSolanaAddress(addr)).toBe(true);
    });
  });

  it("should reject invalid addresses", () => {
    const invalidAddresses = [
      "", // Empty
      "123", // Too short
      "0x1234567890123456789012345678901234567890", // Ethereum format
      "invalid-address-with-dashes",
      "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO", // Contains O (not in base58)
      "0000000000000000000000000000000000000000", // Contains 0 (not in base58)
      "llllllllllllllllllllllllllllllll", // Contains l (not in base58)
      "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII", // Contains I (not in base58)
    ];

    invalidAddresses.forEach((addr) => {
      expect(isValidSolanaAddress(addr)).toBe(false);
    });
  });

  it("should reject addresses that are too long", () => {
    const tooLong = "1".repeat(45);
    expect(isValidSolanaAddress(tooLong)).toBe(false);
  });

  it("should reject addresses that are too short", () => {
    const tooShort = "1".repeat(31);
    expect(isValidSolanaAddress(tooShort)).toBe(false);
  });
});
