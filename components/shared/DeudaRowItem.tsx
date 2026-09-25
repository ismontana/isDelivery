"use client";

import * as React from "react";
import { toast } from "sonner";
import { Droplet, PackageOpen, Receipt } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AmountPromptDialog } from "@/components/shared/AmountPromptDialog";
import { formatDate, formatMoney } from "@/lib/format";
import type { DeudaRow } from "@/types";

const TIPO_LABEL: Record<DeudaRow["tipo"], string> = {
  venta_fiada: "Venta fiada",
  liquido: "Agua prestada",
  envase: "Envase por recoger",
};

const TIPO_ICON: Record<DeudaRow["tipo"], React.ReactNode> = {
  venta_fiada: <Receipt className="h-4 w-4" />,
  liquido: <Droplet className="h-4 w-4" />,
  envase: <PackageOpen className="h-4 w-4" />,
};

export function DeudaRowItem({ row, showCliente = true }: { row: DeudaRow; showCliente?: boolean }) {
  const abonarVenta = useStore((s) => s.abonarVenta);
  const liquidarVenta = useStore((s) => s.liquidarVenta);
  const abonarPrestamoLiquido = useStore((s) => s.abonarPrestamoLiquido);
  const liquidarPrestamoLiquido = useStore((s) => s.liquidarPrestamoLiquido);
  const abonarPrestamoEnvase = useStore((s) => s.abonarPrestamoEnvase);
  const liquidarPrestamoEnvase = useStore((s) => s.liquidarPrestamoEnvase);

  const [promptOpen, setPromptOpen] = React.useState(false);

  const isEnvase = row.tipo === "envase";
  const tamano = row.tamano === "mixto" ? "20L" : (row.tamano as "20L" | "10L");

  function handleLiquidar() {
    if (row.tipo === "venta_fiada") {
      liquidarVenta(row.origenId);
    } else if (row.tipo === "liquido") {
      liquidarPrestamoLiquido(row.origenId);
    } else {
      liquidarPrestamoEnvase(row.origenId, tamano);
    }
    toast.success("Deuda liquidada");
  }

  function handleAbono(value: number) {
    if (row.tipo === "venta_fiada") {
      abonarVenta(row.origenId, value);
    } else if (row.tipo === "liquido") {
      abonarPrestamoLiquido(row.origenId, value);
    } else {
      abonarPrestamoEnvase(row.origenId, tamano, value);
    }
    toast.success("Abono registrado");
  }

  return (
    <div className="flex items-center gap-3 rounded-card border border-border bg-surface-raised p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-accent/10 text-primary-accent">
        {TIPO_ICON[row.tipo]}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {showCliente && (
            <p className="truncate text-sm font-medium text-ink">{row.clienteNombre}</p>
          )}
          <Badge variant="neutral">{TIPO_LABEL[row.tipo]}</Badge>
        </div>
        <p className="text-xs text-ink-muted">
          {row.cantidad} {row.tamano === "mixto" ? "garrafones" : row.tamano} · {formatDate(row.fecha)}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        {!isEnvase && (
          <span className="text-sm font-semibold text-danger">{formatMoney(row.montoAdeudado)}</span>
        )}
        {isEnvase && <span className="text-sm font-semibold text-ink">{row.cantidad} pza.</span>}
        <div className="flex gap-1.5">
          <Button size="sm" variant="outline" onClick={() => setPromptOpen(true)}>
            Abonar
          </Button>
          <Button size="sm" variant="primary" onClick={handleLiquidar}>
            Liquidar
          </Button>
        </div>
      </div>

      <AmountPromptDialog
        open={promptOpen}
        onOpenChange={setPromptOpen}
        title={isEnvase ? "Recoger envases" : "Registrar abono"}
        label={isEnvase ? "Cantidad de envases recogidos" : "Monto a abonar"}
        max={isEnvase ? row.cantidad : row.montoAdeudado}
        prefix={isEnvase ? undefined : "$"}
        onConfirm={handleAbono}
      />
    </div>
  );
}
