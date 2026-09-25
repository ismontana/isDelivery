"use client";

import * as React from "react";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/store/useStore";
import type { Purificadora } from "@/types";

export function PurificadoraModal({
  open,
  onOpenChange,
  purificadora,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purificadora?: Purificadora;
}) {
  const addPurificadora = useStore((s) => s.addPurificadora);
  const updatePurificadora = useStore((s) => s.updatePurificadora);
  const isEditing = !!purificadora;

  const [nombre, setNombre] = React.useState("");
  const [direccion, setDireccion] = React.useState("");
  const [precioLlenado20, setPrecioLlenado20] = React.useState(0);
  const [precioLlenado10, setPrecioLlenado10] = React.useState(0);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    setNombre(purificadora?.nombre ?? "");
    setDireccion(purificadora?.direccion ?? "");
    setPrecioLlenado20(purificadora?.precioLlenado20 ?? 5);
    setPrecioLlenado10(purificadora?.precioLlenado10 ?? 3);
    setError("");
  }, [open, purificadora]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    if (isEditing && purificadora) {
      updatePurificadora(purificadora.id, { nombre, direccion, precioLlenado20, precioLlenado10 });
      toast.success("Purificadora actualizada");
    } else {
      addPurificadora({ nombre, direccion, precioLlenado20, precioLlenado10 });
      toast.success("Purificadora agregada");
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={isEditing ? "Editar purificadora" : "Agregar purificadora"} open={open} className="max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nombre-purificadora">Nombre</Label>
            <Input id="nombre-purificadora" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="direccion-purificadora">Dirección / notas</Label>
            <Input
              id="direccion-purificadora"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Precio llenado 20L</Label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={precioLlenado20}
                onChange={(e) => setPrecioLlenado20(Number(e.target.value))}
              />
            </div>
            <div>
              <Label>Precio llenado 10L</Label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={precioLlenado10}
                onChange={(e) => setPrecioLlenado10(Number(e.target.value))}
              />
            </div>
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
