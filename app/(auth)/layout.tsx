"use client";

import { GuestGate } from "@/components/shared/GuestGate";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <GuestGate>
      <div
        className="flex min-h-screen w-full items-center justify-center px-4"
        style={{
          paddingTop: "max(1.5rem, env(safe-area-inset-top))",
          paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
        }}
      >
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </GuestGate>
  );
}
