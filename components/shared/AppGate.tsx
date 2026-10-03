"use client";

import { useStore } from "@/store/useStore";
import { SplashScreen } from "./SplashScreen";

export function AppGate({ children }: { children: React.ReactNode }) {
  const hydrated = useStore((s) => s.hydrated);

  if (!hydrated) return <SplashScreen />;

  return <>{children}</>;
}
