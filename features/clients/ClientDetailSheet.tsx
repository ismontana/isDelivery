"use client";

import * as React from "react";
import { Phone, Navigation, ClipboardList, ShoppingCart, HandCoins, Pencil, History } from "lucide-react";
import { BottomSheet } from "@/components/shared/BottomSheet";
import { GlassButton } from "@/components/shared/GlassButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NexoDot } from "@/components/shared/NexoSelector";
import { formatMoney } from "@/lib/format";
import type { Cliente } from "@/types";
import { OrderModal } from "./OrderModal";
import { SaleModal } from "./SaleModal";
import { LoanModal } from "./LoanModal";
import { ClientFormModal } from "./ClientFormModal";
import { HistoryModal } from "./HistoryModal";

export function ClientDetailSheet({
  cliente,
  open,
  onOpenChange,
}: {
  cliente: Cliente | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [modal, setModal] = React.useState<
    "pedido" | "venta" | "prestamo" | "editar" | "historial" | null
  >(null);

  if (!cliente) {
    return (
      <BottomSheet open={open} onOpenChange={onOpenChange}>
        <div />
      </BottomSheet>
    );
  }

  const wazeUrl = `https://waze.com/ul?ll=${cliente.lat},${cliente.lng}&navigate=yes`;
  const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${cliente.lat},${cliente.lng}`;

  const actions = [
    { key: "pedido" as const, icon: ClipboardList, label: "Pedido" },
    { key: "venta" as const, icon: ShoppingCart, label: "Venta" },
    { key: "prestamo" as const, icon: HandCoins, label: "Préstamo" },
    { key: "editar" as const, icon: Pencil, label: "Editar" },
    { key: "historial" as const, icon: History, label: "Historial" },
  ];

  return (
    <>
      <BottomSheet open={open} onOpenChange={onOpenChange}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-ink">{cliente.nombre}</h2>
              <NexoDot value={cliente.nexo} />
            </div>
            <p className="text-[13px] text-ink-muted">
              {cliente.colonia ? `${cliente.colonia}, ` : ""}
              {cliente.municipio}
            </p>
          </div>
          <Badge variant={cliente.tipoCliente === "prospecto" ? "prospecto" : "default"}>
            {cliente.tipoCliente === "prospecto" ? "Prospecto" : "Cliente"}
          </Badge>
        </div>

        {cliente.telefono && (
          <div className="mt-3 flex items-center gap-2 text-sm text-ink">
            <Phone className="h-4 w-4 text-ink-muted" />
            {cliente.telefono}
          </div>
        )}

        <div className="mt-2 flex items-center gap-2 text-sm text-ink">
          <span className="text-ink-muted">Garrafón:</span> {cliente.tipoGarrafon}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-black/[0.03] px-3 py-2 dark:bg-white/[0.04]">
            <p className="text-[11px] text-ink-muted">Precio 20L</p>
            <p className="text-sm font-semibold text-ink">{formatMoney(cliente.precio20)}</p>
          </div>
          <div className="rounded-2xl bg-black/[0.03] px-3 py-2 dark:bg-white/[0.04]">
            <p className="text-[11px] text-ink-muted">Precio 10L</p>
            <p className="text-sm font-semibold text-ink">{formatMoney(cliente.precio10)}</p>
          </div>
        </div>

        {cliente.deuda > 0 && (
          <div className="mt-2 flex items-center justify-between rounded-2xl bg-danger/10 px-3 py-2">
            <span className="text-[13px] font-medium text-danger">Deuda actual</span>
            <span className="text-sm font-semibold text-danger">{formatMoney(cliente.deuda)}</span>
          </div>
        )}

        <div className="mt-4 flex justify-between gap-1.5">
          {actions.map((a) => (
            <GlassButton
              key={a.key}
              size="icon"
              tooltip={a.label}
              onClick={() => setModal(a.key)}
              className="flex-1"
            >
              <a.icon className="h-[18px] w-[18px]" />
            </GlassButton>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button variant="glass" asChild>
            <a href={wazeUrl} target="_blank" rel="noreferrer">
              <Navigation className="h-4 w-4" />
              Waze
            </a>
          </Button>
          <Button variant="glass" asChild>
            <a href={gmapsUrl} target="_blank" rel="noreferrer">
              <Navigation className="h-4 w-4" />
              Google Maps
            </a>
          </Button>
        </div>
      </BottomSheet>

      <OrderModal
        open={modal === "pedido"}
        onOpenChange={(o) => !o && setModal(null)}
        clienteId={cliente.id}
      />
      <SaleModal
        open={modal === "venta"}
        onOpenChange={(o) => !o && setModal(null)}
        clienteId={cliente.id}
      />
      <LoanModal
        open={modal === "prestamo"}
        onOpenChange={(o) => !o && setModal(null)}
        clienteId={cliente.id}
      />
      <ClientFormModal
        open={modal === "editar"}
        onOpenChange={(o) => !o && setModal(null)}
        cliente={cliente}
      />
      <HistoryModal
        cliente={cliente}
        open={modal === "historial"}
        onOpenChange={(o) => !o && setModal(null)}
      />
    </>
  );
}
