"use client";

import * as React from "react";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/store/useStore";
import { todayISO } from "@/lib/format";

interface OrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clienteId?: string;
  onSaved?: () => void;
}

export function OrderModal({ open, onOpenChange, clienteId, onSaved }: OrderModalProps) {
  const clientes = useStore((s) => s.clientes);
  const addPedido = useStore((s) => s.addPedido);

  const [selectedClienteId, setSelectedClienteId] = React.useState(clienteId ?? "");
  const [cantidad20, setCantidad20] = React.useState(0);
  const [cantidad10, setCantidad10] = React.useState(0);
  const [notas, setNotas] = React.useState("");
  const [fecha, setFecha] = React.useState(() => todayISO().slice(0, 10));
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    setSelectedClienteId(clienteId ?? clientes[0]?.id ?? "");
    setCantidad20(0);
    setCantidad10(0);
    setNotas("");
    setFecha(todayISO().slice(0, 10));
    setError("");
  }, [open, clienteId, clientes]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedClienteId) {
      setError("Selecciona un cliente");
      return;
    }
    if (cantidad20 <= 0 && cantidad10 <= 0) {
      setError("Indica al menos un garrafón");
      return;
    }
    addPedido({
      clienteId: selectedClienteId,
      fecha: new Date(fecha).toISOString(),
      cantidad20,
      cantidad10,
      notas,
    });
    toast.success("Pedido agregado");
    onSaved?.();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="Nuevo pedido" open={open} className="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Cliente</Label>
            <Select
              value={selectedClienteId}
              onChange={(e) => setSelectedClienteId(e.target.value)}
              disabled={!!clienteId}
            >
              <option value="" disabled>
                Selecciona un cliente
              </option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} · {c.municipio}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="fecha-pedido">Fecha</Label>
            <Input
              id="fecha-pedido"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Garrafones 20L</Label>
              <Input
                type="number"
                min="0"
                value={cantidad20}
                onChange={(e) => setCantidad20(Math.max(0, Number(e.target.value)))}
              />
            </div>
            <div>
              <Label>Garrafones 10L</Label>
              <Input
                type="number"
                min="0"
                value={cantidad10}
                onChange={(e) => setCantidad10(Math.max(0, Number(e.target.value)))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notas-pedido">Notas</Label>
            <Textarea
              id="notas-pedido"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Instrucciones de entrega, referencias..."
            />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
