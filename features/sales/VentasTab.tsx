"use client";

import * as React from "react";
import { ShoppingCart, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { EmptyState } from "@/components/shared/EmptyState";
import { useStore } from "@/store/useStore";
import { formatDate, formatMoney, isSameDay, isSameWeek } from "@/lib/format";
import { SaleModal } from "@/features/clients/SaleModal";

type RangeFilter = "hoy" | "semana" | "todas";

export function VentasTab() {
  const ventas = useStore((s) => s.ventas);
  const clientes = useStore((s) => s.clientes);
  const [range, setRange] = React.useState<RangeFilter>("semana");
  const [saleOpen, setSaleOpen] = React.useState(false);

  const filtered = React.useMemo(() => {
    return ventas.filter((v) => {
      if (range === "hoy") return isSameDay(v.fecha, new Date().toISOString());
      if (range === "semana") return isSameWeek(v.fecha);
      return true;
    });
  }, [ventas, range]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Select
          value={range}
          onChange={(e) => setRange(e.target.value as RangeFilter)}
          className="w-auto min-w-[8rem]"
        >
          <option value="hoy">Hoy</option>
          <option value="semana">Esta semana</option>
          <option value="todas">Todas</option>
        </Select>
        <Button size="sm" onClick={() => setSaleOpen(true)}>
          <Plus className="h-4 w-4" />
          Registrar venta
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<ShoppingCart className="h-6 w-6" />}
          title="Sin ventas"
          description="Las ventas que registres aparecerán aquí"
        />
      ) : (
        <div className="space-y-2.5">
          {filtered.map((v) => {
            const cliente = clientes.find((c) => c.id === v.clienteId);
            return (
              <Card key={v.id} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">
                    {cliente?.nombre ?? "Cliente eliminado"}
                  </p>
                  <p className="text-xs text-ink-muted">
                    {v.cantidad20 > 0 && `${v.cantidad20}×20L `}
                    {v.cantidad10 > 0 && `${v.cantidad10}×10L `}
                    · {formatDate(v.fecha)}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-ink">{formatMoney(v.total)}</p>
                  <Badge variant={v.montoPendiente > 0 ? "danger" : "success"}>
                    {v.montoPendiente > 0 ? "Fiado" : "Pagado"}
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <SaleModal open={saleOpen} onOpenChange={setSaleOpen} />
    </div>
  );
}
