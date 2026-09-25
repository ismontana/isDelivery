"use client";

import { Phone, Navigation, MapPinned } from "lucide-react";
import { BottomSheet } from "@/components/shared/BottomSheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/format";
import type { Cliente } from "@/types";
import { cn } from "@/lib/utils";

const NEXO_DOT: Record<string, string> = {
  rojo: "bg-nexo-rojo",
  amarillo: "bg-nexo-amarillo",
  verde: "bg-nexo-verde",
};

export function ClientMapSheet({
  cliente,
  open,
  onOpenChange,
}: {
  cliente: Cliente | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!cliente) return <BottomSheet open={open} onOpenChange={onOpenChange}><div /></BottomSheet>;

  const wazeUrl = `https://waze.com/ul?ll=${cliente.lat},${cliente.lng}&navigate=yes`;
  const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${cliente.lat},${cliente.lng}`;

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-ink">{cliente.nombre}</h2>
            <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", NEXO_DOT[cliente.nexo])} />
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

      <div className="mt-4 space-y-2">
        {cliente.telefono && (
          <div className="flex items-center gap-2 text-sm text-ink">
            <Phone className="h-4 w-4 text-ink-muted" />
            {cliente.telefono}
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-ink">
          <MapPinned className="h-4 w-4 text-ink-muted" />
          Garrafón preferido: {cliente.tipoGarrafon}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-black/[0.03] px-3 py-2 dark:bg-white/[0.04]">
          <p className="text-[11px] text-ink-muted">Precio 20L</p>
          <p className="text-sm font-semibold text-ink">{formatMoney(cliente.precio20)}</p>
        </div>
        <div className="rounded-2xl bg-black/[0.03] px-3 py-2 dark:bg-white/[0.04]">
          <p className="text-[11px] text-ink-muted">Precio 10L</p>
          <p className="text-sm font-semibold text-ink">{formatMoney(cliente.precio10)}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
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
  );
}
