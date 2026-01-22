import { NextRequest, NextResponse } from "next/server";

// API key se mantiene en servidor, no expuesta al cliente
const HELIUS_API_KEY = process.env.HELIUS_API_KEY;

// Validar formato de dirección Solana (base58, 32-44 chars)
function isValidSolanaAddress(address: string): boolean {
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return base58Regex.test(address);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get("address");

  // Validaciones
  if (!address) {
    return NextResponse.json({ error: "Address required" }, { status: 400 });
  }

  if (!isValidSolanaAddress(address)) {
    return NextResponse.json({ error: "Invalid address format" }, { status: 400 });
  }

  if (!HELIUS_API_KEY) {
    return NextResponse.json({ error: "RPC not configured" }, { status: 503 });
  }

  try {
    const rpcUrl = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

    // Fetch balance
    const balanceResponse = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getBalance",
        params: [address],
      }),
    });

    if (!balanceResponse.ok) {
      throw new Error("RPC request failed");
    }

    const balanceData = await balanceResponse.json();
    const lamports = balanceData.result?.value ?? 0;
    const balance = lamports / 1e9;

    // Fetch SOL price
    let usdValue = null;
    try {
      const priceResponse = await fetch(
        "https://api.dexscreener.com/latest/dex/tokens/So11111111111111111111111111111111111111112",
        { next: { revalidate: 60 } } // Cache por 60 segundos
      );
      const priceData = await priceResponse.json();
      const solPrice = parseFloat(priceData.pairs?.[0]?.priceUsd ?? "0");
      usdValue = balance * solPrice;
    } catch {
      // Price fetch failed, continue without USD value
    }

    return NextResponse.json({ balance, usdValue });
  } catch (error) {
    console.error("Balance fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch balance" }, { status: 500 });
  }
}
