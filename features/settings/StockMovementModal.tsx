"use client";

import * as React from "react";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useStore } from "@/store/useStore";

export function StockMovementModal({
  open,
  onOpenChange,
  tipo,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tipo: "compra" | "roto";
}) {
  const registrarCompraStock = useStore((s) => s.registrarCompraStock);
  const registrarRotoStock = useStore((s) => s.registrarRotoStock);

  const [tamano, setTamano] = React.useState<"20L" | "10L">("20L");
  const [cantidad, setCantidad] = React.useState("");
  const [nota, setNota] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setTamano("20L");
      setCantidad("");
      setNota("");
      setError("");
    }
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const num = Number(cantidad);
    if (!cantidad || isNaN(num) || num <= 0) {
      setError("Ingresa una cantidad válida");
      return;
    }
    if (tipo === "compra") {
      registrarCompraStock(tamano, num, nota);
      toast.success("Compra registrada");
    } else {
      registrarRotoStock(tamano, num, nota);
      toast.success("Garrafones rotos registrados");
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title={tipo === "compra" ? "Registrar compra de garrafones" : "Registrar garrafones rotos"}
        open={open}
        className="max-w-xs"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Tamaño</Label>
            <Select value={tamano} onChange={(e) => setTamano(e.target.value as "20L" | "10L")}>
              <option value="20L">20L</option>
              <option value="10L">10L</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="cantidad-mov">Cantidad</Label>
            <Input
              id="cantidad-mov"
              type="number"
              min="0"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <Label htmlFor="nota-mov">Nota</Label>
            <Input id="nota-mov" value={nota} onChange={(e) => setNota(e.target.value)} />
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
