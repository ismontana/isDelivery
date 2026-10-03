"use client";

import * as React from "react";
import { toast } from "sonner";
import { Droplet, PackageOpen, Receipt, Landmark, AlertCircle } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AmountPromptDialog } from "@/components/shared/AmountPromptDialog";
import { calcularComisionAtraso } from "@/lib/actividad";
import { formatDate, formatMoney } from "@/lib/format";
import type { DeudaRow } from "@/types";

const TIPO_LABEL: Record<DeudaRow["tipo"], string> = {
  venta_fiada: "Venta fiada",
  liquido: "Agua prestada",
  envase: "Envase por recoger",
  deposito_envase: "Depósito de envase",
};

const TIPO_ICON: Record<DeudaRow["tipo"], React.ReactNode> = {
  venta_fiada: <Receipt className="h-4 w-4" />,
  liquido: <Droplet className="h-4 w-4" />,
  envase: <PackageOpen className="h-4 w-4" />,
  deposito_envase: <Landmark className="h-4 w-4" />,
};

export function DeudaRowItem({ row, showCliente = true }: { row: DeudaRow; showCliente?: boolean }) {
  const abonarVenta = useStore((s) => s.abonarVenta);
  const liquidarVenta = useStore((s) => s.liquidarVenta);
  const abonarPrestamoLiquido = useStore((s) => s.abonarPrestamoLiquido);
  const liquidarPrestamoLiquido = useStore((s) => s.liquidarPrestamoLiquido);
  const abonarPrestamoEnvase = useStore((s) => s.abonarPrestamoEnvase);
  const liquidarPrestamoEnvase = useStore((s) => s.liquidarPrestamoEnvase);
  const abonarPrestamoDeposito = useStore((s) => s.abonarPrestamoDeposito);
  const liquidarPrestamoDeposito = useStore((s) => s.liquidarPrestamoDeposito);
  const aplicarComisionAtraso = useStore((s) => s.aplicarComisionAtraso);
  const configuracion = useStore((s) => s.configuracion);

  const [promptOpen, setPromptOpen] = React.useState(false);

  const isEnvase = row.tipo === "envase";
  const isMoney = row.tipo === "venta_fiada" || row.tipo === "liquido" || row.tipo === "deposito_envase";
  const tamano = row.tamano === "mixto" ? "20L" : (row.tamano as "20L" | "10L");

  const comisionSugerida =
    row.tipo === "venta_fiada" ? calcularComisionAtraso(row.fecha, configuracion) : 0;

  function handleLiquidar() {
    if (row.tipo === "venta_fiada") {
      liquidarVenta(row.origenId);
    } else if (row.tipo === "liquido") {
      liquidarPrestamoLiquido(row.origenId);
    } else if (row.tipo === "deposito_envase") {
      liquidarPrestamoDeposito(row.origenId);
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
    } else if (row.tipo === "deposito_envase") {
      abonarPrestamoDeposito(row.origenId, value);
    } else {
      abonarPrestamoEnvase(row.origenId, tamano, value);
    }
    toast.success("Abono registrado");
  }

  function handleAplicarComision() {
    aplicarComisionAtraso(row.origenId, comisionSugerida);
    toast.success(`Comisión de ${formatMoney(comisionSugerida)} aplicada`);
  }

  return (
    <div className="rounded-card border border-border bg-surface-raised p-3">
      <div className="flex items-center gap-3">
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
          {isMoney && (
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
      </div>

      {comisionSugerida > 0 && (
        <div className="mt-2.5 flex items-center justify-between gap-2 rounded-2xl bg-danger/10 px-3 py-2">
          <span className="flex items-center gap-1.5 text-xs font-medium text-danger">
            <AlertCircle className="h-3.5 w-3.5" />
            Comisión por atraso: {formatMoney(comisionSugerida)}
          </span>
          <Button size="sm" variant="danger" onClick={handleAplicarComision}>
            Aplicar
          </Button>
        </div>
      )}

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
