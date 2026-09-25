"use client";

import { useStore } from "@/store/useStore";
import { Droplets } from "lucide-react";

export function AppGate({ children }: { children: React.ReactNode }) {
  const hydrated = useStore((s) => s.hydrated);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-card bg-primary-base text-white">
          <Droplets className="h-8 w-8" />
        </div>
        <p className="text-sm font-medium text-ink-muted">isDelivery</p>
      </div>
    );
  }

  return <>{children}</>;
}
