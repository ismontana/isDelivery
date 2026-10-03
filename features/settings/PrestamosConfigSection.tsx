"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useStore } from "@/store/useStore";
import type { FrecuenciaComision } from "@/types";

export function PrestamosConfigSection() {
  const configuracion = useStore((s) => s.configuracion);
  const updateConfiguracion = useStore((s) => s.updateConfiguracion);

  return (
    <Card className="space-y-4">
      <p className="text-[13px] font-semibold text-ink-muted">Préstamos y cobranza</p>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-ink">Permitir préstamos</p>
          <p className="text-xs text-ink-muted">
            Si lo desactivas, nadie podrá registrar préstamos de envase o garrafón
          </p>
        </div>
        <Switch
          checked={configuracion.prestamoHabilitado}
          onCheckedChange={(v) => updateConfiguracion({ prestamoHabilitado: v })}
        />
      </div>

      {configuracion.prestamoHabilitado && (
        <>
          <div className="flex items-center justify-between border-t border-border pt-4">
            <div>
              <p className="text-sm font-medium text-ink">Cobrar depósito por envase</p>
              <p className="text-xs text-ink-muted">
                El envase prestado tendrá un importe pendiente hasta que se pague
              </p>
            </div>
            <Switch
              checked={configuracion.envasePrestadoConCosto}
              onCheckedChange={(v) => updateConfiguracion({ envasePrestadoConCosto: v })}
            />
          </div>

          {configuracion.envasePrestadoConCosto && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[11px]">Depósito 20L</Label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  defaultValue={configuracion.precioPrestamoEnvase20}
                  onBlur={(e) =>
                    updateConfiguracion({ precioPrestamoEnvase20: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label className="text-[11px]">Depósito 10L</Label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  defaultValue={configuracion.precioPrestamoEnvase10}
                  onBlur={(e) =>
                    updateConfiguracion({ precioPrestamoEnvase10: Number(e.target.value) })
                  }
                />
              </div>
            </div>
          )}
        </>
      )}

      <div className="flex items-center justify-between border-t border-border pt-4">
        <div>
          <p className="text-sm font-medium text-ink">Comisión por atraso en pagos</p>
          <p className="text-xs text-ink-muted">
            Se sugiere un cargo extra en ventas fiadas que llevan tiempo sin pagarse
          </p>
        </div>
        <Switch
          checked={configuracion.comisionRetrasoHabilitada}
          onCheckedChange={(v) => updateConfiguracion({ comisionRetrasoHabilitada: v })}
        />
      </div>

      {configuracion.comisionRetrasoHabilitada && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[11px]">Monto por periodo</Label>
              <Input
                type="number"
                min="0"
                step="1"
                defaultValue={configuracion.comisionRetrasoMonto}
                onBlur={(e) =>
                  updateConfiguracion({ comisionRetrasoMonto: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <Label className="text-[11px]">Frecuencia</Label>
              <Select
                value={configuracion.comisionRetrasoFrecuencia}
                onChange={(e) =>
                  updateConfiguracion({
                    comisionRetrasoFrecuencia: e.target.value as FrecuenciaComision,
                  })
                }
              >
                <option value="diaria">Diaria</option>
                <option value="semanal">Semanal</option>
                <option value="mensual">Mensual</option>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-[11px]">Días de gracia antes de cobrar</Label>
            <Input
              type="number"
              min="0"
              step="1"
              defaultValue={configuracion.comisionRetrasoDiasGracia}
              onBlur={(e) =>
                updateConfiguracion({ comisionRetrasoDiasGracia: Number(e.target.value) })
              }
            />
          </div>
          <p className="text-xs text-ink-muted">
            El repartidor verá la comisión sugerida en cada deuda vencida y decide si la
            aplica al cliente.
          </p>
        </div>
      )}
    </Card>
  );
}
