"use client";

import { PhantomProvider as PhantomSDKProvider, AddressType } from "@phantom/react-sdk";
import { ReactNode } from "react";

interface PhantomProviderProps {
  children: ReactNode;
}

export function PhantomProvider({ children }: PhantomProviderProps) {
  const appId = process.env.NEXT_PUBLIC_PHANTOM_APP_ID;

  // Si no hay appId, mostrar mensaje de configuración
  if (!appId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-8">
        <div className="max-w-md text-center space-y-4">
          <div className="text-6xl">👻</div>
          <h1 className="text-2xl font-bold">Setup Required</h1>
          <p className="text-muted-foreground">
            To use Phantom Connect, you need to configure your App ID.
          </p>
          <div className="bg-muted p-4 rounded-lg text-left text-sm space-y-2">
            <p className="font-medium">Steps:</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Go to <a href="https://phantom.com/portal" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:underline">phantom.com/portal</a></li>
              <li>Create an app</li>
              <li>Copy your App ID</li>
              <li>Create <code className="bg-background px-1 rounded">.env.local</code> file</li>
              <li>Add: <code className="bg-background px-1 rounded">NEXT_PUBLIC_PHANTOM_APP_ID=your-id</code></li>
              <li>Restart the dev server</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PhantomSDKProvider
      config={{
        appId,
        addressTypes: [AddressType.solana],
        providers: ["google", "apple", "phantom", "injected"],
      }}
    >
      {children}
    </PhantomSDKProvider>
  );
}
