"use client";

import * as React from "react";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/useAuthStore";
import type { Plan } from "@/types/auth";

export function PlanModal({
  open,
  onOpenChange,
  plan,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan?: Plan;
}) {
  const addPlan = useAuthStore((s) => s.addPlan);
  const updatePlan = useAuthStore((s) => s.updatePlan);
  const isEditing = !!plan;

  const [nombre, setNombre] = React.useState("");
  const [descripcion, setDescripcion] = React.useState("");
  const [maxRepartidores, setMaxRepartidores] = React.useState(1);
  const [precioMensual, setPrecioMensual] = React.useState(0);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    setNombre(plan?.nombre ?? "");
    setDescripcion(plan?.descripcion ?? "");
    setMaxRepartidores(plan?.maxRepartidores ?? 1);
    setPrecioMensual(plan?.precioMensual ?? 0);
    setError("");
  }, [open, plan]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    if (isEditing && plan) {
      updatePlan(plan.id, { nombre, descripcion, maxRepartidores, precioMensual });
      toast.success("Plan actualizado");
    } else {
      addPlan({ nombre, descripcion, maxRepartidores, precioMensual, activo: true });
      toast.success("Plan creado");
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={isEditing ? "Editar plan" : "Nuevo plan"} open={open} className="max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nombre</Label>
            <Input value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div>
            <Label>Descripción</Label>
            <Textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Repartidores incluidos</Label>
              <Input
                type="number"
                min="1"
                value={maxRepartidores}
                onChange={(e) => setMaxRepartidores(Math.max(1, Number(e.target.value)))}
              />
            </div>
            <div>
              <Label>Precio mensual</Label>
              <Input
                type="number"
                min="0"
                step="1"
                value={precioMensual}
                onChange={(e) => setPrecioMensual(Number(e.target.value))}
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
