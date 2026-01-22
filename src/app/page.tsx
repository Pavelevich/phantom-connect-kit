"use client";

import Image from "next/image";
import { usePhantom } from "@phantom/react-sdk";
import { ConnectButton, WalletInfo, BalanceCard, TokenList, SendSOL } from "@/components/phantom";

export default function Home() {
  const { isConnected } = usePhantom();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border/50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={32}
              height={32}
              className="rounded-md w-8 h-8 object-cover"
            />
            <span className="font-medium text-sm">Phantom Connect Kit</span>
          </div>
          <ConnectButton />
        </div>
      </header>

      <main className="flex-1">
        {!isConnected ? <Landing /> : <Dashboard />}
      </main>

      <footer className="border-t border-border/50 py-6">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Image
              src="/tetsuo.jpg"
              alt="Tetsuo"
              width={20}
              height={20}
              className="rounded w-5 h-5 object-cover"
            />
            <span>Built with Phantom Connect</span>
          </div>
          <a
            href="https://docs.phantom.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Docs
          </a>
        </div>
      </footer>
    </div>
  );
}

function Landing() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-24">
      <div className="max-w-xl">
        <h1 className="text-3xl font-semibold tracking-tight mb-4">
          Ship Solana apps faster
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Pre-built components for Phantom Connect.
          Users sign in with Google or Apple. No extensions, no seed phrases.
        </p>
        <ConnectButton />
      </div>

      <div className="mt-24 grid grid-cols-3 gap-px bg-border/50 rounded-lg overflow-hidden">
        <Feature
          title="OAuth"
          desc="Google & Apple sign-in"
        />
        <Feature
          title="Embedded"
          desc="Wallet created instantly"
        />
        <Feature
          title="Components"
          desc="Ready to use UI"
        />
      </div>

      <div className="mt-24">
        <p className="text-xs text-muted-foreground mb-4">Quick start</p>
        <code className="block bg-card border border-border rounded-lg p-4 text-sm font-mono">
          <span className="text-muted-foreground">$</span> npx create-phantom-app my-app
        </code>
      </div>
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-card p-6">
      <p className="font-medium text-sm mb-1">{title}</p>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-xl font-medium mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <WalletInfo />
        <BalanceCard />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <TokenList maxItems={5} />
        <SendSOL />
      </div>

      <div className="mt-8 p-6 bg-card border border-border rounded-lg">
        <p className="text-sm font-medium mb-4">Next steps</p>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex items-center gap-3">
            <span className="w-1 h-1 rounded-full bg-primary" />
            Edit <code className="text-xs bg-muted px-1.5 py-0.5 rounded">src/app/page.tsx</code>
          </li>
          <li className="flex items-center gap-3">
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            Add Helius API key for balance
          </li>
          <li className="flex items-center gap-3">
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            Build your features
          </li>
        </ul>
      </div>
    </div>
  );
}
