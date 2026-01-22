import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIP, rateLimitHeaders } from "@/lib/rate-limit";

const HELIUS_API_KEY = process.env.HELIUS_API_KEY;

// Rate limit: 20 requests per minute per IP
const RATE_LIMIT = 20;
const RATE_WINDOW = 60000;

// Validate Solana address format
function isValidSolanaAddress(address: string): boolean {
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return base58Regex.test(address);
}

export interface Token {
  mint: string;
  symbol: string;
  name: string;
  balance: number;
  decimals: number;
  logo?: string;
  usdValue?: number;
}

export async function GET(request: NextRequest) {
  // Rate limiting
  const clientIP = getClientIP(request);
  const rateLimitResult = rateLimit(clientIP, RATE_LIMIT, RATE_WINDOW);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: rateLimitHeaders(rateLimitResult, RATE_LIMIT) }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get("address");

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

    // Fetch fungible tokens using Helius DAS API
    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getAssetsByOwner",
        params: {
          ownerAddress: address,
          displayOptions: {
            showFungible: true,
            showNativeBalance: false,
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error("RPC request failed");
    }

    const data = await response.json();
    const items = data.result?.items || [];

    // Filter and map fungible tokens
    const tokens: Token[] = items
      .filter((item: Record<string, unknown>) =>
        item.interface === "FungibleToken" || item.interface === "FungibleAsset"
      )
      .map((item: Record<string, unknown>) => {
        const tokenInfo = item.token_info as Record<string, unknown> | undefined;
        const content = item.content as Record<string, unknown> | undefined;
        const metadata = content?.metadata as Record<string, unknown> | undefined;
        const links = content?.links as Record<string, unknown> | undefined;

        const balance = tokenInfo?.balance
          ? Number(tokenInfo.balance) / Math.pow(10, Number(tokenInfo.decimals || 0))
          : 0;

        const pricePerToken = tokenInfo?.price_info
          ? (tokenInfo.price_info as Record<string, unknown>).price_per_token as number
          : undefined;

        return {
          mint: item.id as string,
          symbol: (tokenInfo?.symbol as string) || (metadata?.symbol as string) || "???",
          name: (metadata?.name as string) || (tokenInfo?.symbol as string) || "Unknown Token",
          balance,
          decimals: Number(tokenInfo?.decimals || 0),
          logo: links?.image as string | undefined,
          usdValue: pricePerToken ? balance * pricePerToken : undefined,
        };
      })
      .filter((token: Token) => token.balance > 0)
      .sort((a: Token, b: Token) => (b.usdValue || 0) - (a.usdValue || 0));

    return NextResponse.json({ tokens });
  } catch (error) {
    console.error("Token fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch tokens" }, { status: 500 });
  }
}
