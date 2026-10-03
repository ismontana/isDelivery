"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { SplashScreen } from "./SplashScreen";

export function GuestGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hydrated = useAuthStore((s) => s.hydrated);
  const currentUser = useAuthStore((s) => s.getCurrentUser());

  React.useEffect(() => {
    if (!hydrated || !currentUser) return;
    router.replace(currentUser.rol === "super_admin" ? "/admin-plataforma" : "/map");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, currentUser?.id]);

  if (!hydrated) return <SplashScreen />;
  if (currentUser) return <SplashScreen />;

  return <>{children}</>;
}
