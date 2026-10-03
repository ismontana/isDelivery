"use client";

import { Building2, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import { formatDate } from "@/lib/format";
import { EstadoLicenciaBadge } from "@/features/platform/EstadoLicenciaBadge";

export function MiNegocioSection({ negocioId }: { negocioId: string }) {
  const negocio = useAuthStore((s) => s.negocios.find((n) => n.id === negocioId));
  const getLicenciaActiva = useAuthStore((s) => s.getLicenciaActiva);
  const getEstadoEfectivo = useAuthStore((s) => s.getEstadoEfectivo);
  const getPlan = useAuthStore((s) => s.getPlan);

  if (!negocio) return null;

  const licencia = getLicenciaActiva(negocioId);
  const plan = licencia ? getPlan(licencia.planId) : undefined;

  return (
    <Card className="space-y-3">
      <p className="text-[13px] font-semibold text-ink-muted">Mi negocio</p>
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-accent/10 text-primary-accent">
          <Building2 className="h-4.5 w-4.5" />
        </div>
        <div>
          <p className="text-sm font-medium text-ink">{negocio.nombre}</p>
          <p className="text-xs text-ink-muted">
            {negocio.tipo === "independiente" ? "Vendedor independiente" : "Purificadora"}
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-black/[0.03] px-3 py-2.5 dark:bg-white/[0.04]">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
            <Calendar className="h-3.5 w-3.5" /> Licencia
          </span>
          {licencia ? (
            <EstadoLicenciaBadge estado={getEstadoEfectivo(licencia)} />
          ) : (
            <span className="text-xs text-ink-muted">Sin licencia</span>
          )}
        </div>
        {licencia && (
          <p className="mt-1 text-xs text-ink-muted">
            Plan {plan?.nombre ?? "—"} · vence el {formatDate(licencia.fechaFin)}
          </p>
        )}
      </div>
      <p className="text-[11px] text-ink-muted">
        ¿Necesitas cambiar de plan o renovar? Contacta a soporte de isDelivery.
      </p>
    </Card>
  );
}
