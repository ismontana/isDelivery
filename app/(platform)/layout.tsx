"use client";

import { LogOut, ShieldCheck } from "lucide-react";
import { AppGate } from "@/components/shared/AppGate";
import { AuthGate } from "@/components/shared/AuthGate";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function PlatformTopBar() {
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  function handleLogout() {
    logout();
    toast.success("Sesión cerrada");
    router.replace("/login");
  }

  return (
    <header
      className="glass glass-shadow sticky top-0 z-30 flex items-center justify-between px-4 py-3"
      style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
    >
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-base text-white">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">isDelivery</p>
          <p className="text-[11px] text-ink-muted">Panel de plataforma</p>
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={handleLogout}>
        <LogOut className="h-4 w-4" />
        Salir
      </Button>
    </header>
  );
}

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppGate>
      <AuthGate allow={["super_admin"]}>
        <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col">
          <PlatformTopBar />
          <div
            className="flex-1 px-4 pb-10 pt-4"
            style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}
          >
            {children}
          </div>
        </div>
      </AuthGate>
    </AppGate>
  );
}
