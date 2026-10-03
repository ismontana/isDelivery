"use client";

import * as React from "react";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useStore, type NuevoPrestamoInput } from "@/store/useStore";
import { formatMoney, todayISO } from "@/lib/format";

interface LoanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clienteId: string;
  onSaved?: () => void;
}

export function LoanModal({ open, onOpenChange, clienteId, onSaved }: LoanModalProps) {
  const cliente = useStore((s) => s.clientes.find((c) => c.id === clienteId));
  const configuracion = useStore((s) => s.configuracion);
  const addPrestamo = useStore((s) => s.addPrestamo);

  const [envase20, setEnvase20] = React.useState(0);
  const [envase10, setEnvase10] = React.useState(0);
  const [liquido20, setLiquido20] = React.useState(0);
  const [liquido10, setLiquido10] = React.useState(0);
  const [aguaPagada, setAguaPagada] = React.useState(false);
  const [precioLiquido20, setPrecioLiquido20] = React.useState(0);
  const [precioLiquido10, setPrecioLiquido10] = React.useState(0);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    setEnvase20(0);
    setEnvase10(0);
    setLiquido20(0);
    setLiquido10(0);
    setAguaPagada(false);
    setPrecioLiquido20(cliente?.precio20 ?? 0);
    setPrecioLiquido10(cliente?.precio10 ?? 0);
    setError("");
  }, [open, cliente]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (envase20 <= 0 && envase10 <= 0 && liquido20 <= 0 && liquido10 <= 0) {
      setError("Registra al menos un envase o garrafón prestado");
      return;
    }
    const input: NuevoPrestamoInput = {
      clienteId,
      fecha: todayISO(),
      envase20,
      envase10,
      liquido20,
      liquido10,
      aguaPagada,
      precioLiquido20,
      precioLiquido10,
    };
    addPrestamo(input);
    toast.success("Préstamo registrado");
    onSaved?.();
    onOpenChange(false);
  }

  const montoLiquido = aguaPagada ? 0 : liquido20 * precioLiquido20 + liquido10 * precioLiquido10;
  const totalEnvasesPendientes = envase20 + envase10 + liquido20 + liquido10;
  const montoDeposito = configuracion.envasePrestadoConCosto
    ? (envase20 + liquido20) * configuracion.precioPrestamoEnvase20 +
      (envase10 + liquido10) * configuracion.precioPrestamoEnvase10
    : 0;

  if (!configuracion.prestamoHabilitado) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent title="Préstamos desactivados" open={open} className="max-w-sm">
          <p className="text-sm text-ink-muted">
            La opción de préstamos está desactivada para este negocio. Actívala en{" "}
            <span className="font-medium text-ink">Ajustes → Préstamos y cobranza</span> si
            quieres volver a prestar envases o garrafones.
          </p>
          <div className="mt-4 flex justify-end">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="Registrar préstamo" open={open} className="max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-[13px] text-ink-muted">
            {configuracion.envasePrestadoConCosto
              ? "El envase prestado lleva un depósito configurado en Ajustes. Si el agua no está pagada, también quedará pendiente cobrarla."
              : "El envase prestado no tiene costo en este negocio. Si el agua no está pagada, quedará pendiente cobrarla junto con recoger el envase."}
          </p>

          <div className="space-y-2">
            <Label>
              Envases prestados{configuracion.envasePrestadoConCosto ? " (con depósito)" : " (sin costo)"}
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[11px]">20L</Label>
                <Input
                  type="number"
                  min="0"
                  value={envase20}
                  onChange={(e) => setEnvase20(Math.max(0, Number(e.target.value)))}
                />
              </div>
              <div>
                <Label className="text-[11px]">10L</Label>
                <Input
                  type="number"
                  min="0"
                  value={envase10}
                  onChange={(e) => setEnvase10(Math.max(0, Number(e.target.value)))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Garrafones llenos prestados</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[11px]">20L</Label>
                <Input
                  type="number"
                  min="0"
                  value={liquido20}
                  onChange={(e) => setLiquido20(Math.max(0, Number(e.target.value)))}
                />
              </div>
              <div>
                <Label className="text-[11px]">10L</Label>
                <Input
                  type="number"
                  min="0"
                  value={liquido10}
                  onChange={(e) => setLiquido10(Math.max(0, Number(e.target.value)))}
                />
              </div>
            </div>
          </div>

          {(liquido20 > 0 || liquido10 > 0) && (
            <>
              <div className="flex items-center justify-between rounded-2xl border border-border px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-ink">¿El agua ya fue pagada?</p>
                  <p className="text-xs text-ink-muted">
                    Si no, quedará pendiente cobrarla al recoger el envase
                  </p>
                </div>
                <Switch checked={aguaPagada} onCheckedChange={setAguaPagada} />
              </div>
              {!aguaPagada && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[11px]">Precio 20L</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.5"
                      value={precioLiquido20}
                      onChange={(e) => setPrecioLiquido20(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label className="text-[11px]">Precio 10L</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.5"
                      value={precioLiquido10}
                      onChange={(e) => setPrecioLiquido10(Number(e.target.value))}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          <div className="space-y-1 rounded-2xl bg-black/[0.03] px-4 py-3 dark:bg-white/[0.04]">
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-muted">Envases por recoger</span>
              <span className="font-semibold text-ink">{totalEnvasesPendientes}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-muted">Monto de agua pendiente</span>
              <span className="font-semibold text-ink">
                {montoLiquido > 0 ? formatMoney(montoLiquido) : "—"}
              </span>
            </div>
            {configuracion.envasePrestadoConCosto && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-muted">Depósito por envase</span>
                <span className="font-semibold text-ink">
                  {montoDeposito > 0 ? formatMoney(montoDeposito) : "—"}
                </span>
              </div>
            )}
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
