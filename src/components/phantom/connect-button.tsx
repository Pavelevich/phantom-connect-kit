"use client";

import { usePhantom, useModal, useDisconnect } from "@phantom/react-sdk";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ConnectButtonProps {
  className?: string;
}

export function ConnectButton({ className }: ConnectButtonProps) {
  const { isConnected, addresses, isLoading } = usePhantom();
  const { open } = useModal();
  const { disconnect } = useDisconnect();

  const solanaAddress = addresses?.find((a) => a.addressType === "Solana")?.address;
  const short = solanaAddress
    ? `${solanaAddress.slice(0, 4)}...${solanaAddress.slice(-4)}`
    : null;

  if (isConnected && short) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "h-8 px-3 rounded-md text-xs font-mono",
              "bg-white/5 border border-white/10",
              "hover:bg-white/10 hover:border-white/20",
              "transition-all duration-150",
              className
            )}
          >
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {short}
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[140px]">
          <DropdownMenuItem
            onClick={() => solanaAddress && navigator.clipboard.writeText(solanaAddress)}
            className="text-xs cursor-pointer"
          >
            Copy address
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => disconnect()}
            className="text-xs cursor-pointer text-red-400 focus:text-red-400"
          >
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <button
      onClick={() => open()}
      disabled={isLoading}
      className={cn(
        "h-8 px-4 rounded-md text-xs font-medium",
        "bg-white text-black",
        "hover:bg-white/90",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "transition-all duration-150",
        className
      )}
    >
      {isLoading ? "..." : "Connect"}
    </button>
  );
}
