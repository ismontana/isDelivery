"use client";

import * as React from "react";
import { PackagePlus, PackageMinus, History as HistoryIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stat } from "@/components/shared/Stat";
import { EmptyState } from "@/components/shared/EmptyState";
import { useStore } from "@/store/useStore";
import { formatDate } from "@/lib/format";
import { StockMovementModal } from "./StockMovementModal";

const TIPO_LABEL: Record<string, string> = {
  compra: "Compra",
  roto: "Roto",
  venta: "Venta con envase",
  prestamo_salida: "Préstamo",
  prestamo_regreso: "Envase recogido",
  ajuste: "Ajuste",
};

export function InventarioSection() {
  const stock = useStore((s) => s.stock);
  const movimientos = useStore((s) => s.movimientos);
  const [modal, setModal] = React.useState<"compra" | "roto" | null>(null);
  const [showHistory, setShowHistory] = React.useState(false);

  const circulacion20 = stock.propio20 + stock.enPoderClientes20;
  const circulacion10 = stock.propio10 + stock.enPoderClientes10;

  return (
    <div className="space-y-3">
      <p className="text-[13px] font-semibold text-ink-muted">Inventario de garrafones</p>

      <div className="grid grid-cols-2 gap-2.5">
        <Stat label="Propio 20L" value={`${stock.propio20}`} sub="disponibles" />
        <Stat label="Propio 10L" value={`${stock.propio10}`} sub="disponibles" />
        <Stat label="En clientes 20L" value={`${stock.enPoderClientes20}`} />
        <Stat label="En clientes 10L" value={`${stock.enPoderClientes10}`} />
      </div>

      <Card>
        <p className="mb-1 text-[13px] font-semibold text-ink-muted">En circulación (total)</p>
        <div className="flex justify-between text-sm">
          <span className="text-ink-muted">20L</span>
          <span className="font-medium text-ink">{circulacion20}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-ink-muted">10L</span>
          <span className="font-medium text-ink">{circulacion10}</span>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-2">
        <Button size="sm" variant="outline" onClick={() => setModal("compra")}>
          <PackagePlus className="h-4 w-4" />
          Compra
        </Button>
        <Button size="sm" variant="outline" onClick={() => setModal("roto")}>
          <PackageMinus className="h-4 w-4" />
          Roto
        </Button>
      </div>

      <button
        onClick={() => setShowHistory((v) => !v)}
        className="flex items-center gap-1.5 text-xs font-medium text-primary-accent"
      >
        <HistoryIcon className="h-3.5 w-3.5" />
        {showHistory ? "Ocultar" : "Ver"} historial de movimientos
      </button>

      {showHistory && (
        <>
          {movimientos.length === 0 ? (
            <EmptyState icon={<HistoryIcon className="h-6 w-6" />} title="Sin movimientos" className="py-6" />
          ) : (
            <div className="max-h-64 space-y-1.5 overflow-y-auto no-scrollbar">
              {movimientos.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-xl border border-border px-3 py-2 text-xs"
                >
                  <div>
                    <p className="font-medium text-ink">
                      {TIPO_LABEL[m.tipo] ?? m.tipo} · {m.tamano}
                    </p>
                    <p className="text-ink-muted">{m.nota}</p>
                  </div>
                  <div className="text-right">
                    <p className={m.cantidad >= 0 ? "font-semibold text-nexo-verde" : "font-semibold text-danger"}>
                      {m.cantidad >= 0 ? "+" : ""}
                      {m.cantidad}
                    </p>
                    <p className="text-ink-muted">{formatDate(m.fecha)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <StockMovementModal
        open={modal !== null}
        onOpenChange={(o) => !o && setModal(null)}
        tipo={modal ?? "compra"}
      />
    </div>
  );
}
