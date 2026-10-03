"use client";

import * as React from "react";
import { BottomSheet } from "@/components/shared/BottomSheet";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { DeudaRowItem } from "@/components/shared/DeudaRowItem";
import { useStore } from "@/store/useStore";
import { formatDate, formatMoney } from "@/lib/format";
import { History, Receipt } from "lucide-react";
import type { Cliente } from "@/types";

export function HistoryModal({
  cliente,
  open,
  onOpenChange,
}: {
  cliente: Cliente | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const ventas = useStore((s) => (cliente ? s.ventas.filter((v) => v.clienteId === cliente.id) : []));
  const prestamos = useStore((s) =>
    cliente ? s.prestamos.filter((p) => p.clienteId === cliente.id) : []
  );
  const deudas = useStore((s) => s.getDeudas());
  const deudasCliente = cliente ? deudas.filter((d) => d.clienteId === cliente.id) : [];

  const totalComprado20 = ventas.reduce((sum, v) => sum + v.cantidad20, 0);
  const totalComprado10 = ventas.reduce((sum, v) => sum + v.cantidad10, 0);

  if (!cliente) {
    return (
      <BottomSheet open={open} onOpenChange={onOpenChange}>
        <div />
      </BottomSheet>
    );
  }

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange} title={`Historial · ${cliente.nombre}`}>
      <div className="max-h-[68vh] space-y-5 overflow-y-auto no-scrollbar pb-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-black/[0.03] px-3 py-2.5 dark:bg-white/[0.04]">
            <p className="text-[11px] text-ink-muted">Comprados 20L</p>
            <p className="text-lg font-semibold text-ink">{totalComprado20}</p>
          </div>
          <div className="rounded-2xl bg-black/[0.03] px-3 py-2.5 dark:bg-white/[0.04]">
            <p className="text-[11px] text-ink-muted">Comprados 10L</p>
            <p className="text-lg font-semibold text-ink">{totalComprado10}</p>
          </div>
        </div>

        <section>
          <h3 className="mb-2 text-[13px] font-semibold text-ink-muted">Deudas pendientes</h3>
          {deudasCliente.length === 0 ? (
            <EmptyState
              icon={<Receipt className="h-6 w-6" />}
              title="Sin deudas"
              description="Este cliente está al corriente"
              className="py-6"
            />
          ) : (
            <div className="space-y-2">
              {deudasCliente.map((d) => (
                <DeudaRowItem key={d.id} row={d} showCliente={false} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h3 className="mb-2 text-[13px] font-semibold text-ink-muted">Ventas</h3>
          {ventas.length === 0 ? (
            <p className="text-sm text-ink-muted">Sin ventas registradas</p>
          ) : (
            <div className="space-y-2">
              {ventas.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between rounded-2xl border border-border px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {v.cantidad20 > 0 && `${v.cantidad20}×20L `}
                      {v.cantidad10 > 0 && `${v.cantidad10}×10L`}
                    </p>
                    <p className="text-xs text-ink-muted">{formatDate(v.fecha)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-ink">{formatMoney(v.total)}</p>
                    <Badge variant={v.montoPendiente > 0 ? "danger" : "success"}>
                      {v.montoPendiente > 0 ? "Fiado" : "Pagado"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h3 className="mb-2 text-[13px] font-semibold text-ink-muted">Préstamos</h3>
          {prestamos.length === 0 ? (
            <p className="text-sm text-ink-muted">Sin préstamos registrados</p>
          ) : (
            <div className="space-y-2">
              {prestamos.map((p) => (
                <div key={p.id} className="rounded-2xl border border-border px-3 py-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-ink">{formatDate(p.fecha)}</p>
                    <History className="h-4 w-4 text-ink-muted" />
                  </div>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    Envase: {p.envase20}×20L, {p.envase10}×10L · Líquido: {p.liquido20}×20L,{" "}
                    {p.liquido10}×10L
                  </p>
                  <p className="mt-1 text-xs">
                    Pendiente:{" "}
                    <span className="font-medium text-ink">
                      {p.envase20Pendiente + p.envase10Pendiente} envases
                    </span>
                    {p.montoLiquidoPendiente > 0 && (
                      <span className="font-medium text-danger">
                        {" "}
                        · {formatMoney(p.montoLiquidoPendiente)} de agua
                      </span>
                    )}
                    {p.montoDepositoPendiente > 0 && (
                      <span className="font-medium text-danger">
                        {" "}
                        · {formatMoney(p.montoDepositoPendiente)} de depósito
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </BottomSheet>
  );
}
