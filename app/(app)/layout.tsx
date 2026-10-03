"use client";

import { AppGate } from "@/components/shared/AppGate";
import { AuthGate } from "@/components/shared/AuthGate";
import { BottomTabBar } from "@/components/shared/BottomTabBar";

export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppGate>
      <AuthGate allow={["admin", "repartidor"]}>
        <div className="mx-auto flex min-h-screen w-full max-w-md flex-col pb-[var(--tabbar-height)] pt-[var(--header-top-pad)] sm:max-w-lg md:max-w-2xl">
          {children}
        </div>
        <BottomTabBar />
      </AuthGate>
    </AppGate>
  );
}
