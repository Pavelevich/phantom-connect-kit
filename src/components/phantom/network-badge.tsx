"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Network = "mainnet" | "devnet" | "testnet";

interface NetworkBadgeProps {
  network?: Network;
  className?: string;
}

const networkConfig: Record<Network, { label: string; className: string }> = {
  mainnet: {
    label: "Mainnet",
    className: "bg-green-100 text-green-700 hover:bg-green-100",
  },
  devnet: {
    label: "Devnet",
    className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  },
  testnet: {
    label: "Testnet",
    className: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  },
};

export function NetworkBadge({ network = "mainnet", className }: NetworkBadgeProps) {
  const config = networkConfig[network];

  return (
    <Badge variant="secondary" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
