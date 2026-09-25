"use client";

import * as React from "react";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/store/useStore";
import { todayISO } from "@/lib/format";

export function GastoModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const addGasto = useStore((s) => s.addGasto);
  const [monto, setMonto] = React.useState("");
  const [nota, setNota] = React.useState("");
  const [fecha, setFecha] = React.useState(() => todayISO().slice(0, 10));
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setMonto("");
      setNota("");
      setFecha(todayISO().slice(0, 10));
      setError("");
    }
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const num = Number(monto);
    if (!monto || isNaN(num) || num <= 0) {
      setError("Ingresa un monto válido");
      return;
    }
    addGasto({ monto: num, nota, fecha: new Date(fecha).toISOString() });
    toast.success("Gasto registrado");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="Registrar gasto de combustible" open={open} className="max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="monto-gasto">Monto</Label>
            <Input
              id="monto-gasto"
              type="number"
              min="0"
              step="0.01"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div>
            <Label htmlFor="fecha-gasto">Fecha</Label>
            <Input
              id="fecha-gasto"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="nota-gasto">Nota</Label>
            <Input
              id="nota-gasto"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              placeholder="Ej. gasolina ruta Huamantla"
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
