"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import type { RolUsuario } from "@/types/auth";
import { SplashScreen } from "./SplashScreen";

function homeFor(rol: RolUsuario): string {
  return rol === "super_admin" ? "/admin-plataforma" : "/map";
}

export function AuthGate({
  allow,
  children,
}: {
  allow: RolUsuario[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const hydrated = useAuthStore((s) => s.hydrated);
  const currentUser = useAuthStore((s) => s.getCurrentUser());

  React.useEffect(() => {
    if (!hydrated) return;
    if (!currentUser) {
      router.replace("/login");
      return;
    }
    if (!allow.includes(currentUser.rol)) {
      router.replace(homeFor(currentUser.rol));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, currentUser?.id, currentUser?.rol]);

  if (!hydrated || !currentUser || !allow.includes(currentUser.rol)) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
