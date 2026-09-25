"use client";

import * as React from "react";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DaySelector } from "@/components/shared/DaySelector";
import { useStore } from "@/store/useStore";
import type { DiaSemana, Municipio } from "@/types";

export function MunicipioModal({
  open,
  onOpenChange,
  municipio,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  municipio?: Municipio;
}) {
  const addMunicipio = useStore((s) => s.addMunicipio);
  const updateMunicipio = useStore((s) => s.updateMunicipio);
  const isEditing = !!municipio;

  const [nombre, setNombre] = React.useState("");
  const [precioVenta20, setPrecioVenta20] = React.useState(20);
  const [precioVenta10, setPrecioVenta10] = React.useState(12);
  const [diasRuta, setDiasRuta] = React.useState<DiaSemana[]>([]);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    setNombre(municipio?.nombre ?? "");
    setPrecioVenta20(municipio?.precioVenta20 ?? 20);
    setPrecioVenta10(municipio?.precioVenta10 ?? 12);
    setDiasRuta(municipio?.diasRuta ?? []);
    setError("");
  }, [open, municipio]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    if (isEditing && municipio) {
      updateMunicipio(municipio.id, { nombre, precioVenta20, precioVenta10, diasRuta });
      toast.success("Municipio actualizado");
    } else {
      addMunicipio({ nombre, precioVenta20, precioVenta10, diasRuta });
      toast.success("Municipio agregado");
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={isEditing ? "Editar municipio" : "Agregar municipio"} open={open} className="max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nombre-municipio">Nombre</Label>
            <Input id="nombre-municipio" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Precio venta 20L</Label>
              <Input
                type="number"
                min="0"
                step="0.5"
                value={precioVenta20}
                onChange={(e) => setPrecioVenta20(Number(e.target.value))}
              />
            </div>
            <div>
              <Label>Precio venta 10L</Label>
              <Input
                type="number"
                min="0"
                step="0.5"
                value={precioVenta10}
                onChange={(e) => setPrecioVenta10(Number(e.target.value))}
              />
            </div>
          </div>
          <div>
            <Label>Días de ruta</Label>
            <DaySelector value={diasRuta} onChange={setDiasRuta} />
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
