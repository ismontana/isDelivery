"use client";

import * as React from "react";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useStore, type NuevaVentaInput } from "@/store/useStore";
import { formatMoney, todayISO } from "@/lib/format";
import type { EstadoPago } from "@/types";

interface SaleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clienteId?: string;
  pedidoId?: string;
  prefill?: { cantidad20?: number; cantidad10?: number };
  onSaved?: () => void;
}

export function SaleModal({
  open,
  onOpenChange,
  clienteId,
  pedidoId,
  prefill,
  onSaved,
}: SaleModalProps) {
  const clientes = useStore((s) => s.clientes);
  const envaseDefault = useStore((s) => s.envaseDefault);
  const addVenta = useStore((s) => s.addVenta);
  const completarPedido = useStore((s) => s.completarPedido);

  const [selectedClienteId, setSelectedClienteId] = React.useState(clienteId ?? "");
  const [cantidad20, setCantidad20] = React.useState(0);
  const [cantidad10, setCantidad10] = React.useState(0);
  const [precio20, setPrecio20] = React.useState(0);
  const [precio10, setPrecio10] = React.useState(0);
  const [incluyeEnvase, setIncluyeEnvase] = React.useState(false);
  const [envase20Cantidad, setEnvase20Cantidad] = React.useState(0);
  const [envase10Cantidad, setEnvase10Cantidad] = React.useState(0);
  const [precioEnvase20, setPrecioEnvase20] = React.useState(envaseDefault.precio20);
  const [precioEnvase10, setPrecioEnvase10] = React.useState(envaseDefault.precio10);
  const [estadoPago, setEstadoPago] = React.useState<EstadoPago>("pagado");
  const [error, setError] = React.useState("");

  const cliente = clientes.find((c) => c.id === selectedClienteId);

  React.useEffect(() => {
    if (!open) return;
    const cid = clienteId ?? clientes[0]?.id ?? "";
    setSelectedClienteId(cid);
    const c = clientes.find((x) => x.id === cid);
    setCantidad20(prefill?.cantidad20 ?? 0);
    setCantidad10(prefill?.cantidad10 ?? 0);
    setPrecio20(c?.precio20 ?? 0);
    setPrecio10(c?.precio10 ?? 0);
    setIncluyeEnvase(false);
    setEnvase20Cantidad(0);
    setEnvase10Cantidad(0);
    setPrecioEnvase20(envaseDefault.precio20);
    setPrecioEnvase10(envaseDefault.precio10);
    setEstadoPago("pagado");
    setError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, clienteId]);

  function handleClienteChange(id: string) {
    setSelectedClienteId(id);
    const c = clientes.find((x) => x.id === id);
    if (c) {
      setPrecio20(c.precio20);
      setPrecio10(c.precio10);
    }
  }

  const totalAgua = cantidad20 * precio20 + cantidad10 * precio10;
  const totalEnvase = incluyeEnvase
    ? envase20Cantidad * precioEnvase20 + envase10Cantidad * precioEnvase10
    : 0;
  const total = totalAgua + totalEnvase;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedClienteId) {
      setError("Selecciona un cliente");
      return;
    }
    if (cantidad20 <= 0 && cantidad10 <= 0) {
      setError("Registra al menos un garrafón");
      return;
    }
    const input: NuevaVentaInput = {
      clienteId: selectedClienteId,
      fecha: todayISO(),
      cantidad20,
      cantidad10,
      precio20,
      precio10,
      incluyeEnvase,
      envase20Cantidad: incluyeEnvase ? envase20Cantidad : 0,
      envase10Cantidad: incluyeEnvase ? envase10Cantidad : 0,
      precioEnvase20,
      precioEnvase10,
      estadoPago,
    };

    if (pedidoId) {
      completarPedido(pedidoId, input);
      toast.success("Pedido completado");
    } else {
      addVenta(input);
      toast.success("Venta registrada");
    }
    onSaved?.();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={pedidoId ? "Completar pedido" : "Registrar venta"} open={open} className="max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Cliente</Label>
            <Select
              value={selectedClienteId}
              onChange={(e) => handleClienteChange(e.target.value)}
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
              <Label>Precio unitario 20L</Label>
              <Input
                type="number"
                min="0"
                step="0.5"
                value={precio20}
                onChange={(e) => setPrecio20(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Garrafones 10L</Label>
              <Input
                type="number"
                min="0"
                value={cantidad10}
                onChange={(e) => setCantidad10(Math.max(0, Number(e.target.value)))}
              />
            </div>
            <div>
              <Label>Precio unitario 10L</Label>
              <Input
                type="number"
                min="0"
                step="0.5"
                value={precio10}
                onChange={(e) => setPrecio10(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-border px-4 py-3">
            <div>
              <p className="text-sm font-medium text-ink">Incluye envase</p>
              <p className="text-xs text-ink-muted">El cliente compra el garrafón vacío</p>
            </div>
            <Switch checked={incluyeEnvase} onCheckedChange={setIncluyeEnvase} />
          </div>

          {incluyeEnvase && (
            <div className="space-y-3 rounded-2xl bg-black/[0.02] p-3 dark:bg-white/[0.03]">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Envases 20L</Label>
                  <Input
                    type="number"
                    min="0"
                    value={envase20Cantidad}
                    onChange={(e) => setEnvase20Cantidad(Math.max(0, Number(e.target.value)))}
                  />
                </div>
                <div>
                  <Label>Precio envase 20L</Label>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={precioEnvase20}
                    onChange={(e) => setPrecioEnvase20(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Envases 10L</Label>
                  <Input
                    type="number"
                    min="0"
                    value={envase10Cantidad}
                    onChange={(e) => setEnvase10Cantidad(Math.max(0, Number(e.target.value)))}
                  />
                </div>
                <div>
                  <Label>Precio envase 10L</Label>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={precioEnvase10}
                    onChange={(e) => setPrecioEnvase10(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <Label>Estado de pago</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setEstadoPago("pagado")}
                className={`tap-target rounded-2xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                  estadoPago === "pagado"
                    ? "border-transparent bg-nexo-verde/15 text-nexo-verde"
                    : "border-border text-ink-muted"
                }`}
              >
                Pagado
              </button>
              <button
                type="button"
                onClick={() => setEstadoPago("fiado")}
                className={`tap-target rounded-2xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                  estadoPago === "fiado"
                    ? "border-transparent bg-danger/15 text-danger"
                    : "border-border text-ink-muted"
                }`}
              >
                Fiado
              </button>
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
