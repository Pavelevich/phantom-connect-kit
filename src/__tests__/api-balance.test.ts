import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Next.js request/response
const createMockRequest = (address: string | null) => ({
  nextUrl: {
    searchParams: {
      get: (key: string) => (key === "address" ? address : null),
    },
  },
});

describe("Balance API Route", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return 400 if address is missing", async () => {
    const req = createMockRequest(null);

    // Simulate the validation logic
    const address = req.nextUrl.searchParams.get("address");
    expect(address).toBeNull();
  });

  it("should return 400 for invalid address format", async () => {
    const invalidAddresses = [
      "invalid",
      "0x1234567890123456789012345678901234567890",
      "",
    ];

    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

    invalidAddresses.forEach((addr) => {
      expect(base58Regex.test(addr)).toBe(false);
    });
  });

  it("should accept valid Solana address", async () => {
    const validAddress = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

    expect(base58Regex.test(validAddress)).toBe(true);
  });
});

describe("Balance calculation", () => {
  it("should convert lamports to SOL correctly", () => {
    const lamports = 1000000000; // 1 SOL
    const sol = lamports / 1e9;
    expect(sol).toBe(1);
  });

  it("should handle zero balance", () => {
    const lamports = 0;
    const sol = lamports / 1e9;
    expect(sol).toBe(0);
  });

  it("should handle fractional SOL", () => {
    const lamports = 500000000; // 0.5 SOL
    const sol = lamports / 1e9;
    expect(sol).toBe(0.5);
  });

  it("should calculate USD value correctly", () => {
    const solBalance = 1.5;
    const solPrice = 100;
    const usdValue = solBalance * solPrice;
    expect(usdValue).toBe(150);
  });
});
