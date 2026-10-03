"use client";

import * as React from "react";
import { Plus, Search, Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Stat } from "@/components/shared/Stat";
import { EmptyState } from "@/components/shared/EmptyState";
import { useAuthStore } from "@/store/useAuthStore";
import { formatDate } from "@/lib/format";
import type { Negocio } from "@/types/auth";
import { EstadoLicenciaBadge } from "./EstadoLicenciaBadge";
import { NegocioDetailSheet } from "./NegocioDetailSheet";
import { NegocioFormModal } from "./NegocioFormModal";

export function NegociosTab() {
  const negocios = useAuthStore((s) => s.negocios);
  const getLicenciaActiva = useAuthStore((s) => s.getLicenciaActiva);
  const getEstadoEfectivo = useAuthStore((s) => s.getEstadoEfectivo);
  const getPlan = useAuthStore((s) => s.getPlan);
  const getRepartidores = useAuthStore((s) => s.getRepartidores);

  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<Negocio | null>(null);
  const [addOpen, setAddOpen] = React.useState(false);

  const filtered = negocios.filter((n) =>
    n.nombre.toLowerCase().includes(search.trim().toLowerCase())
  );

  const activos = negocios.filter((n) => n.activo).length;
  const licenciasVencidas = negocios.filter((n) => {
    const l = getLicenciaActiva(n.id);
    return l && getEstadoEfectivo(l) === "vencida";
  }).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2.5">
        <Stat label="Negocios" value={`${negocios.length}`} />
        <Stat label="Activos" value={`${activos}`} tone="success" />
        <Stat label="Vencidos" value={`${licenciasVencidas}`} tone="danger" />
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <Input
            placeholder="Buscar negocio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button size="icon" onClick={() => setAddOpen(true)} aria-label="Nuevo negocio">
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Building2 className="h-6 w-6" />} title="Sin negocios" />
      ) : (
        <div className="space-y-2.5">
          {filtered.map((n) => {
            const licencia = getLicenciaActiva(n.id);
            const plan = licencia ? getPlan(licencia.planId) : undefined;
            const repartidores = getRepartidores(n.id);
            return (
              <Card key={n.id} className="cursor-pointer" onClick={() => setSelected(n)}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{n.nombre}</p>
                    <p className="text-xs text-ink-muted">
                      {plan?.nombre ?? "Sin plan"} · {repartidores.length} repartidor
                      {repartidores.length === 1 ? "" : "es"}
                    </p>
                    {licencia && (
                      <p className="text-[11px] text-ink-muted">
                        Vence {formatDate(licencia.fechaFin)}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    {licencia ? (
                      <EstadoLicenciaBadge estado={getEstadoEfectivo(licencia)} />
                    ) : (
                      <Badge variant="neutral">Sin licencia</Badge>
                    )}
                    {!n.activo && <Badge variant="danger">Suspendido</Badge>}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <NegocioDetailSheet
        negocio={selected}
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
      <NegocioFormModal open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
