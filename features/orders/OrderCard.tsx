"use client";

import * as React from "react";
import { Phone, MapPin, Trash2, CheckCircle2, StickyNote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { SaleModal } from "@/features/clients/SaleModal";
import { useStore } from "@/store/useStore";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";
import type { Pedido } from "@/types";

export function OrderCard({ pedido }: { pedido: Pedido }) {
  const cliente = useStore((s) => s.clientes.find((c) => c.id === pedido.clienteId));
  const deletePedido = useStore((s) => s.deletePedido);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [saleOpen, setSaleOpen] = React.useState(false);

  if (!cliente) return null;

  return (
    <Card className="space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-ink">{cliente.nombre}</p>
          <p className="flex items-center gap-1 text-xs text-ink-muted">
            <MapPin className="h-3 w-3" />
            {cliente.municipio}
            {cliente.colonia ? `, ${cliente.colonia}` : ""}
          </p>
        </div>
        <span className="whitespace-nowrap text-xs text-ink-muted">{formatDate(pedido.fecha)}</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {pedido.cantidad20 > 0 && (
          <span className="rounded-capsule bg-primary-accent/10 px-2.5 py-1 text-xs font-medium text-primary-accent">
            {pedido.cantidad20} × 20L
          </span>
        )}
        {pedido.cantidad10 > 0 && (
          <span className="rounded-capsule bg-primary-accent/10 px-2.5 py-1 text-xs font-medium text-primary-accent">
            {pedido.cantidad10} × 10L
          </span>
        )}
      </div>

      {pedido.notas && (
        <p className="flex items-start gap-1.5 text-xs text-ink-muted">
          <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {pedido.notas}
        </p>
      )}

      {cliente.telefono && (
        <a
          href={`tel:${cliente.telefono}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-accent"
        >
          <Phone className="h-3.5 w-3.5" />
          {cliente.telefono}
        </a>
      )}

      <div className="flex gap-2 pt-1">
        <Button size="sm" variant="primary" className="flex-1" onClick={() => setSaleOpen(true)}>
          <CheckCircle2 className="h-4 w-4" />
          Completar
        </Button>
        <Button size="sm" variant="outline" onClick={() => setConfirmOpen(true)} aria-label="Eliminar pedido">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Eliminar pedido"
        description={`¿Eliminar el pedido de ${cliente.nombre}? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        onConfirm={() => {
          deletePedido(pedido.id);
          toast.success("Pedido eliminado");
        }}
      />

      <SaleModal
        open={saleOpen}
        onOpenChange={setSaleOpen}
        clienteId={cliente.id}
        pedidoId={pedido.id}
        prefill={{ cantidad20: pedido.cantidad20, cantidad10: pedido.cantidad10 }}
      />
    </Card>
  );
}
