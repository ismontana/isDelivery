"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogOut, UserCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/useAuthStore";

const ROL_LABEL: Record<string, string> = {
  admin: "Administrador",
  repartidor: "Repartidor",
  super_admin: "Plataforma",
};

export function CuentaSection() {
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.getCurrentUser());
  const negocio = useAuthStore((s) => s.getCurrentNegocio());
  const logout = useAuthStore((s) => s.logout);

  if (!currentUser) return null;

  function handleLogout() {
    logout();
    toast.success("Sesión cerrada");
    router.replace("/login");
  }

  return (
    <Card className="space-y-3">
      <p className="text-[13px] font-semibold text-ink-muted">Cuenta</p>
      <div className="flex items-center gap-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-accent/10 text-primary-accent">
          <UserCircle className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">{currentUser.nombre}</p>
          <p className="truncate text-xs text-ink-muted">{currentUser.email}</p>
        </div>
        <Badge variant="default">{ROL_LABEL[currentUser.rol]}</Badge>
      </div>
      {negocio && <p className="text-xs text-ink-muted">{negocio.nombre}</p>}

      <Button variant="danger" className="w-full" onClick={handleLogout}>
        <LogOut className="h-4 w-4" />
        Cerrar sesión
      </Button>
    </Card>
  );
}
