"use client";

import * as React from "react";
import { toast } from "sonner";
import { Phone, Mail, Users, Plus, Ban, CheckCircle2 } from "lucide-react";
import { BottomSheet } from "@/components/shared/BottomSheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useAuthStore } from "@/store/useAuthStore";
import { formatDate, formatMoney } from "@/lib/format";
import type { Negocio } from "@/types/auth";
import { EstadoLicenciaBadge } from "./EstadoLicenciaBadge";
import { LicenciaModal } from "./LicenciaModal";

export function NegocioDetailSheet({
  negocio,
  open,
  onOpenChange,
}: {
  negocio: Negocio | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const licencias = useAuthStore((s) =>
    negocio ? s.licencias.filter((l) => l.negocioId === negocio.id) : []
  );
  const usuarios = useAuthStore((s) =>
    negocio ? s.usuarios.filter((u) => u.negocioId === negocio.id) : []
  );
  const getPlan = useAuthStore((s) => s.getPlan);
  const getEstadoEfectivo = useAuthStore((s) => s.getEstadoEfectivo);
  const toggleNegocioActivo = useAuthStore((s) => s.toggleNegocioActivo);

  const [licenciaOpen, setLicenciaOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  if (!negocio) {
    return (
      <BottomSheet open={open} onOpenChange={onOpenChange}>
        <div />
      </BottomSheet>
    );
  }

  const licenciasOrdenadas = [...licencias].sort((a, b) => (a.fechaFin < b.fechaFin ? 1 : -1));
  const admin = usuarios.find((u) => u.rol === "admin");
  const repartidores = usuarios.filter((u) => u.rol === "repartidor");

  return (
    <>
      <BottomSheet open={open} onOpenChange={onOpenChange} title={negocio.nombre}>
        <div className="max-h-[70vh] space-y-5 overflow-y-auto no-scrollbar pb-2">
          <div className="flex items-center gap-2">
            <Badge variant={negocio.tipo === "independiente" ? "neutral" : "default"}>
              {negocio.tipo === "independiente" ? "Independiente" : "Purificadora"}
            </Badge>
            <Badge variant={negocio.activo ? "success" : "danger"}>
              {negocio.activo ? "Activo" : "Suspendido"}
            </Badge>
          </div>

          <div className="space-y-1.5 text-sm">
            {admin && (
              <p className="flex items-center gap-2 text-ink">
                <Mail className="h-3.5 w-3.5 text-ink-muted" /> {admin.email}
              </p>
            )}
            {negocio.telefonoContacto && (
              <p className="flex items-center gap-2 text-ink">
                <Phone className="h-3.5 w-3.5 text-ink-muted" /> {negocio.telefonoContacto}
              </p>
            )}
            <p className="flex items-center gap-2 text-ink">
              <Users className="h-3.5 w-3.5 text-ink-muted" />
              {repartidores.length} repartidor{repartidores.length === 1 ? "" : "es"}
            </p>
          </div>

          <section>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-ink-muted">Licencias</h3>
              <Button size="sm" onClick={() => setLicenciaOpen(true)}>
                <Plus className="h-3.5 w-3.5" />
                Emitir
              </Button>
            </div>
            {licenciasOrdenadas.length === 0 ? (
              <p className="text-sm text-ink-muted">Sin licencias emitidas</p>
            ) : (
              <div className="space-y-2">
                {licenciasOrdenadas.map((l) => {
                  const plan = getPlan(l.planId);
                  const estado = getEstadoEfectivo(l);
                  return (
                    <div key={l.id} className="rounded-2xl border border-border px-3 py-2.5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-ink">{plan?.nombre ?? "Plan eliminado"}</p>
                        <EstadoLicenciaBadge estado={estado} />
                      </div>
                      <p className="text-xs text-ink-muted">
                        {formatDate(l.fechaInicio)} – {formatDate(l.fechaFin)} ·{" "}
                        {formatMoney(l.precioPagado)}
                      </p>
                      {l.notas && <p className="mt-0.5 text-xs text-ink-muted">{l.notas}</p>}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <Button
            variant={negocio.activo ? "danger" : "primary"}
            className="w-full"
            onClick={() => setConfirmOpen(true)}
          >
            {negocio.activo ? (
              <>
                <Ban className="h-4 w-4" /> Suspender negocio
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" /> Reactivar negocio
              </>
            )}
          </Button>
        </div>
      </BottomSheet>

      <LicenciaModal open={licenciaOpen} onOpenChange={setLicenciaOpen} negocioId={negocio.id} />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={negocio.activo ? "Suspender negocio" : "Reactivar negocio"}
        description={
          negocio.activo
            ? `Nadie en "${negocio.nombre}" podrá iniciar sesión hasta que lo reactives.`
            : `Los usuarios de "${negocio.nombre}" podrán volver a iniciar sesión.`
        }
        destructive={negocio.activo}
        confirmLabel={negocio.activo ? "Suspender" : "Reactivar"}
        onConfirm={() => {
          toggleNegocioActivo(negocio.id);
          toast.success(negocio.activo ? "Negocio suspendido" : "Negocio reactivado");
        }}
      />
    </>
  );
}
