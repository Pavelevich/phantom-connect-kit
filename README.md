# Phantom Connect Kit

Build Solana apps with embedded wallets in minutes. Powered by [Phantom Connect](https://phantom.app).

## Features

- **OAuth Login** - Sign in with Google or Apple. No seed phrases.
- **Embedded Wallets** - Wallets created instantly, ready to use.
- **Pre-built Components** - ConnectButton, WalletInfo, BalanceCard, and more.
- **TypeScript** - Full type safety out of the box.
- **Tailwind + shadcn/ui** - Beautiful, accessible components.

## Quick Start

### 1. Get your App ID

1. Go to [Phantom Portal](https://phantom.com/portal)
2. Create a new app
3. Copy your App ID

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your App ID:

```env
NEXT_PUBLIC_PHANTOM_APP_ID=your-app-id-here
```

### 3. Install dependencies

```bash
npm install
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## Components

### ConnectButton

```tsx
import { ConnectButton } from "@/components/phantom";

<ConnectButton />
<ConnectButton fullWidth />
<ConnectButton className="custom-class" />
```

### WalletInfo

```tsx
import { WalletInfo } from "@/components/phantom";

<WalletInfo />
<WalletInfo showDisconnect={false} />
```

### BalanceCard

```tsx
import { BalanceCard } from "@/components/phantom";

<BalanceCard />
```

### NetworkBadge

```tsx
import { NetworkBadge } from "@/components/phantom";

<NetworkBadge network="mainnet" />
<NetworkBadge network="devnet" />
<NetworkBadge network="testnet" />
```

## Hooks

### useBalance

```tsx
import { useBalance } from "@/hooks/use-balance";

const { balance, usdValue, isLoading, error, refetch } = useBalance(address);
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout with PhantomProvider
│   └── page.tsx        # Main page
├── components/
│   ├── phantom/        # Phantom-specific components
│   │   ├── connect-button.tsx
│   │   ├── wallet-info.tsx
│   │   ├── balance-card.tsx
│   │   ├── network-badge.tsx
│   │   └── phantom-provider.tsx
│   ├── layout/
│   │   └── header.tsx
│   └── ui/             # shadcn/ui components
├── hooks/
│   └── use-balance.ts
└── lib/
    └── utils.ts
```

## Customization

### Theme

Edit `src/app/globals.css` to customize colors. The default theme uses Phantom's purple palette.

### Add More Components

```bash
npx shadcn@latest add [component-name]
```

## Resources

- [Phantom Connect Docs](https://docs.phantom.com/sdks/react-sdk)
- [Phantom Portal](https://phantom.com/portal)
- [shadcn/ui](https://ui.shadcn.com)
- [Helius API](https://docs.helius.dev)

## License

MIT
