"use client";

import * as React from "react";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useStore } from "@/store/useStore";
import { formatMoney, todayISO } from "@/lib/format";

export function LlenadoModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const purificadoras = useStore((s) => s.purificadoras);
  const addLlenado = useStore((s) => s.addLlenado);

  const [purificadoraId, setPurificadoraId] = React.useState(purificadoras[0]?.id ?? "");
  const [fecha, setFecha] = React.useState(() => todayISO().slice(0, 10));
  const [cantidad20, setCantidad20] = React.useState(0);
  const [precio20, setPrecio20] = React.useState(0);
  const [cantidad10, setCantidad10] = React.useState(0);
  const [precio10, setPrecio10] = React.useState(0);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    const p = purificadoras[0];
    setPurificadoraId(p?.id ?? "");
    setPrecio20(p?.precioLlenado20 ?? 0);
    setPrecio10(p?.precioLlenado10 ?? 0);
    setCantidad20(0);
    setCantidad10(0);
    setFecha(todayISO().slice(0, 10));
    setError("");
  }, [open, purificadoras]);

  function handlePurificadoraChange(id: string) {
    setPurificadoraId(id);
    const p = purificadoras.find((x) => x.id === id);
    if (p) {
      setPrecio20(p.precioLlenado20);
      setPrecio10(p.precioLlenado10);
    }
  }

  const total = cantidad20 * precio20 + cantidad10 * precio10;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!purificadoraId) {
      setError("Selecciona una purificadora");
      return;
    }
    if (cantidad20 <= 0 && cantidad10 <= 0) {
      setError("Registra al menos un garrafón llenado");
      return;
    }
    addLlenado({
      purificadoraId,
      fecha: new Date(fecha).toISOString(),
      cantidad20,
      precio20,
      cantidad10,
      precio10,
    });
    toast.success("Llenado registrado");
    onOpenChange(false);
  }

  if (purificadoras.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent title="Registrar llenado" open={open} className="max-w-md">
          <p className="text-sm text-ink-muted">
            Agrega primero una purificadora en Ajustes para poder registrar llenados.
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="Registrar llenado" open={open} className="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Purificadora</Label>
            <Select value={purificadoraId} onChange={(e) => handlePurificadoraChange(e.target.value)}>
              {purificadoras.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="fecha-llenado">Fecha</Label>
            <Input
              id="fecha-llenado"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Cantidad 20L</Label>
              <Input
                type="number"
                min="0"
                value={cantidad20}
                onChange={(e) => setCantidad20(Math.max(0, Number(e.target.value)))}
              />
            </div>
            <div>
              <Label>Precio 20L</Label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={precio20}
                onChange={(e) => setPrecio20(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Cantidad 10L</Label>
              <Input
                type="number"
                min="0"
                value={cantidad10}
                onChange={(e) => setCantidad10(Math.max(0, Number(e.target.value)))}
              />
            </div>
            <div>
              <Label>Precio 10L</Label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={precio10}
                onChange={(e) => setPrecio10(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-primary-base px-4 py-3 text-white">
            <span className="text-sm font-medium">Total</span>
            <span className="text-lg font-semibold">{formatMoney(total)}</span>
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
