"use client";

import Image from "next/image";
import { ConnectButton } from "@/components/phantom";
import { NetworkBadge } from "@/components/phantom";

interface HeaderProps {
  appName?: string;
  network?: "mainnet" | "devnet" | "testnet";
}

export function Header({ appName = "My App", network = "mainnet" }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src="/logo.jpg"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-lg w-10 h-10 object-cover"
          />
          <span className="font-semibold text-lg">{appName}</span>
          <NetworkBadge network={network} />
        </div>
        <ConnectButton />
      </div>
    </header>
  );
}
