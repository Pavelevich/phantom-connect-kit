<p align="center">
  <img src="public/logo.jpg" alt="Phantom Connect Kit" width="80" height="80" style="border-radius: 16px;" />
</p>

<h1 align="center">Phantom Connect Kit</h1>

<p align="center">
  <strong>Production-ready components for Phantom embedded wallets</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/create-phantom-app"><img src="https://img.shields.io/npm/v/create-phantom-app?style=flat&colorA=18181b&colorB=white" alt="npm version"></a>
  <a href="https://github.com/Pavelevich/phantom-connect-kit/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-18181b?style=flat&colorA=18181b&colorB=white" alt="license"></a>
</p>

<p align="center">
  <a href="#installation">Installation</a> ·
  <a href="#components">Components</a> ·
  <a href="#hooks">Hooks</a> ·
  <a href="https://docs.phantom.com">Documentation</a>
</p>

<br />

## Overview

Phantom Connect Kit provides everything you need to integrate Phantom's embedded wallet into your Solana application. Users sign in with Google or Apple—no browser extensions, no seed phrases.

```bash
npx create-phantom-app my-app
```

<br />

## Features

| | |
|---|---|
| **OAuth Authentication** | Google and Apple sign-in out of the box |
| **Embedded Wallets** | Wallets created instantly on first login |
| **Server-side Security** | API keys never exposed to client |
| **Type Safe** | Full TypeScript support |
| **Tested** | Comprehensive test coverage with Vitest |
| **Modern Stack** | Next.js 15, React 19, Tailwind CSS 4 |

<br />

## Installation

### Using create-phantom-app (Recommended)

```bash
npx create-phantom-app my-app
cd my-app
npm install
```

### Manual Setup

```bash
git clone https://github.com/Pavelevich/phantom-connect-kit.git
cd phantom-connect-kit/template
npm install
```

### Configuration

1. Get your App ID from [phantom.com/portal](https://phantom.com/portal)
2. Add it to `.env.local`:

```env
NEXT_PUBLIC_PHANTOM_APP_ID=your-app-id
HELIUS_API_KEY=your-helius-key          # Optional: for balance fetching
```

3. Start the development server:

```bash
npm run dev
```

<br />

## Components

### ConnectButton

Handles wallet connection with loading and connected states.

```tsx
import { ConnectButton } from "@/components/phantom";

<ConnectButton />
<ConnectButton className="custom-styles" />
```

### WalletInfo

Displays the connected wallet address with copy functionality.

```tsx
import { WalletInfo } from "@/components/phantom";

<WalletInfo />
<WalletInfo showDisconnect={false} />
```

### BalanceCard

Shows SOL balance with real-time USD conversion.

```tsx
import { BalanceCard } from "@/components/phantom";

<BalanceCard />
```

> Requires `HELIUS_API_KEY` for balance fetching.

### NetworkBadge

Visual indicator for the current network.

```tsx
import { NetworkBadge } from "@/components/phantom";

<NetworkBadge network="mainnet" />
<NetworkBadge network="devnet" />
```

<br />

## Hooks

### useBalance

Fetch wallet balance with automatic USD conversion.

```tsx
import { useBalance } from "@/hooks/use-balance";

function MyComponent() {
  const { balance, usdValue, isLoading, error, refetch } = useBalance(address);

  if (isLoading) return <span>Loading...</span>;
  if (error) return <span>Error fetching balance</span>;

  return <span>{balance} SOL (${usdValue})</span>;
}
```

<br />

## API Routes

### GET /api/balance

Secure server-side balance fetching with address validation.

```
GET /api/balance?address=<solana-address>

Response:
{
  "balance": 1.5,
  "usdValue": 150.00
}
```

<br />

## Project Structure

```
src/
├── app/
│   ├── api/balance/        # Secure balance endpoint
│   ├── layout.tsx          # PhantomProvider wrapper
│   └── page.tsx            # Demo page
├── components/
│   ├── phantom/            # Wallet components
│   └── ui/                 # shadcn/ui primitives
├── hooks/
│   └── use-balance.ts      # Balance hook
└── __tests__/              # Test suites
```

<br />

## Environment Variables

| Variable | Required | Description |
|:---------|:--------:|:------------|
| `NEXT_PUBLIC_PHANTOM_APP_ID` | Yes | Your Phantom App ID from [phantom.com/portal](https://phantom.com/portal) |
| `HELIUS_API_KEY` | No | Helius API key for balance fetching. Get one at [helius.dev](https://helius.dev) |

<br />

## Scripts

| Command | Description |
|:--------|:------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run test` | Run test suite |
| `npm run lint` | Run ESLint |

<br />

## Built With

- [Next.js 15](https://nextjs.org) — React framework with App Router
- [Phantom SDK](https://docs.phantom.com) — Embedded wallet integration
- [Tailwind CSS 4](https://tailwindcss.com) — Utility-first styling
- [shadcn/ui](https://ui.shadcn.com) — Accessible component primitives
- [Vitest](https://vitest.dev) — Fast unit testing

<br />

## Contributing

Contributions are welcome. Please open an issue first to discuss what you would like to change.

<br />

## License

[MIT](LICENSE)
