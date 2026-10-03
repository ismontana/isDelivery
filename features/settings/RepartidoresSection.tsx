"use client";

import * as React from "react";
import { Plus, Users, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useAuthStore } from "@/store/useAuthStore";
import { RepartidorFormModal } from "./RepartidorFormModal";
import { toast } from "sonner";
import type { Usuario } from "@/types/auth";

export function RepartidoresSection({ negocioId }: { negocioId: string }) {
  const repartidores = useAuthStore((s) => s.getRepartidores(negocioId));
  const toggleUsuarioActivo = useAuthStore((s) => s.toggleUsuarioActivo);
  const eliminarUsuario = useAuthStore((s) => s.eliminarUsuario);
  const getLicenciaActiva = useAuthStore((s) => s.getLicenciaActiva);
  const getPlan = useAuthStore((s) => s.getPlan);

  const [addOpen, setAddOpen] = React.useState(false);
  const [toDelete, setToDelete] = React.useState<Usuario | null>(null);

  const licencia = getLicenciaActiva(negocioId);
  const plan = licencia ? getPlan(licencia.planId) : undefined;
  const limite = plan?.maxRepartidores ?? null;
  const alLimite = limite !== null && repartidores.length >= limite;

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] font-semibold text-ink-muted">Repartidores</p>
          {limite !== null && (
            <p className="text-xs text-ink-muted">
              {repartidores.length} de {limite} incluidos en tu plan
            </p>
          )}
        </div>
        <Button
          size="sm"
          variant="glass"
          disabled={alLimite}
          onClick={() => setAddOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Agregar
        </Button>
      </div>

      {alLimite && (
        <p className="text-xs text-danger">
          Llegaste al límite de repartidores de tu plan. Contacta a soporte para ampliarlo.
        </p>
      )}

      {repartidores.length === 0 ? (
        <EmptyState icon={<Users className="h-6 w-6" />} title="Sin repartidores" className="py-6" />
      ) : (
        <div className="space-y-2">
          {repartidores.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between gap-2 rounded-2xl border border-border px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{r.nombre}</p>
                <p className="truncate text-xs text-ink-muted">{r.email}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Switch checked={r.activo} onCheckedChange={() => toggleUsuarioActivo(r.id)} />
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Eliminar"
                  onClick={() => setToDelete(r)}
                >
                  <Trash2 className="h-4 w-4 text-danger" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <RepartidorFormModal open={addOpen} onOpenChange={setAddOpen} negocioId={negocioId} />
      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Eliminar repartidor"
        description={`${toDelete?.nombre} ya no podrá iniciar sesión. Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        onConfirm={() => {
          if (toDelete) {
            eliminarUsuario(toDelete.id);
            toast.success("Repartidor eliminado");
          }
        }}
      />
    </Card>
  );
}
