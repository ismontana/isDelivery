"use client";

import * as React from "react";
import { Droplets, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stat } from "@/components/shared/Stat";
import { EmptyState } from "@/components/shared/EmptyState";
import { useStore } from "@/store/useStore";
import { formatDate, formatMoney } from "@/lib/format";
import { LlenadoModal } from "./LlenadoModal";

export function LlenadosTab() {
  const llenados = useStore((s) => s.llenados);
  const purificadoras = useStore((s) => s.purificadoras);
  const ventas = useStore((s) => s.ventas);
  const stock = useStore((s) => s.stock);
  const [open, setOpen] = React.useState(false);

  const totalLlenado20 = llenados.reduce((sum, l) => sum + l.cantidad20, 0);
  const totalLlenado10 = llenados.reduce((sum, l) => sum + l.cantidad10, 0);
  const totalGastado = llenados.reduce((sum, l) => sum + l.total, 0);
  const totalVendido20 = ventas.reduce((sum, v) => sum + v.cantidad20, 0);
  const totalVendido10 = ventas.reduce((sum, v) => sum + v.cantidad10, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2.5">
        <Stat label="Llenados 20L" value={`${totalLlenado20}`} sub="garrafones" />
        <Stat label="Llenados 10L" value={`${totalLlenado10}`} sub="garrafones" />
        <Stat label="Gasto total" value={formatMoney(totalGastado)} />
        <Stat label="Stock restante" value={`${stock.propio20 + stock.propio10}`} sub="disponibles" />
      </div>

      <Card>
        <p className="mb-2 text-[13px] font-semibold text-ink-muted">Cruce llenados vs. vendidos</p>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-ink-muted">Llenados (20L / 10L)</span>
            <span className="font-medium text-ink">
              {totalLlenado20} / {totalLlenado10}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">Vendidos (20L / 10L)</span>
            <span className="font-medium text-ink">
              {totalVendido20} / {totalVendido10}
            </span>
          </div>
          <div className="flex justify-between border-t border-border pt-1.5">
            <span className="text-ink-muted">Stock propio restante</span>
            <span className="font-medium text-ink">
              {stock.propio20} × 20L, {stock.propio10} × 10L
            </span>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Registrar llenado
        </Button>
      </div>

      {llenados.length === 0 ? (
        <EmptyState icon={<Droplets className="h-6 w-6" />} title="Sin llenados registrados" />
      ) : (
        <div className="space-y-2.5">
          {llenados.map((l) => {
            const p = purificadoras.find((x) => x.id === l.purificadoraId);
            return (
              <Card key={l.id} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">
                    {p?.nombre ?? "Purificadora eliminada"}
                  </p>
                  <p className="text-xs text-ink-muted">
                    {l.cantidad20 > 0 && `${l.cantidad20}×20L `}
                    {l.cantidad10 > 0 && `${l.cantidad10}×10L `}
                    · {formatDate(l.fecha)}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-ink">{formatMoney(l.total)}</span>
              </Card>
            );
          })}
        </div>
      )}

      <LlenadoModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
