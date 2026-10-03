"use client";

import * as React from "react";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/useAuthStore";
import { todayISO } from "@/lib/format";

export function LicenciaModal({
  open,
  onOpenChange,
  negocioId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  negocioId: string;
}) {
  const planes = useAuthStore((s) => s.planes.filter((p) => p.activo));
  const emitirLicencia = useAuthStore((s) => s.emitirLicencia);

  const [planId, setPlanId] = React.useState(planes[0]?.id ?? "");
  const [fechaInicio, setFechaInicio] = React.useState(() => todayISO().slice(0, 10));
  const [fechaFin, setFechaFin] = React.useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [precioPagado, setPrecioPagado] = React.useState(0);
  const [notas, setNotas] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    const plan = planes[0];
    setPlanId(plan?.id ?? "");
    setPrecioPagado(plan?.precioMensual ?? 0);
    setFechaInicio(todayISO().slice(0, 10));
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    setFechaFin(d.toISOString().slice(0, 10));
    setNotas("");
    setError("");
  }, [open, planes]);

  function handlePlanChange(id: string) {
    setPlanId(id);
    const plan = planes.find((p) => p.id === id);
    if (plan) setPrecioPagado(plan.precioMensual);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!planId) {
      setError("Selecciona un plan");
      return;
    }
    if (fechaFin < fechaInicio) {
      setError("La fecha de fin debe ser posterior al inicio");
      return;
    }
    emitirLicencia({ negocioId, planId, fechaInicio, fechaFin, precioPagado, notas });
    toast.success("Licencia emitida");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="Emitir / renovar licencia" open={open} className="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Plan</Label>
            <Select value={planId} onChange={(e) => handlePlanChange(e.target.value)}>
              {planes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} · {p.maxRepartidores} repartidores
                </option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Fecha inicio</Label>
              <Input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div>
              <Label>Fecha fin</Label>
              <Input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Precio pagado</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={precioPagado}
              onChange={(e) => setPrecioPagado(Number(e.target.value))}
            />
          </div>
          <div>
            <Label>Notas</Label>
            <Textarea value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Opcional" />
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
