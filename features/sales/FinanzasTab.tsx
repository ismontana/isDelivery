"use client";

import * as React from "react";
import { Plus, Fuel } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stat } from "@/components/shared/Stat";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/store/useStore";
import { formatMoney, isSameMonth } from "@/lib/format";
import { GastoModal } from "./GastoModal";

function buildWeeklySeries(ventasFecha: { fecha: string; total: number }[]) {
  const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const now = new Date();
  const result: { label: string; total: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const total = ventasFecha
      .filter((v) => {
        const vd = new Date(v.fecha);
        return (
          vd.getFullYear() === d.getFullYear() &&
          vd.getMonth() === d.getMonth() &&
          vd.getDate() === d.getDate()
        );
      })
      .reduce((sum, v) => sum + v.total, 0);
    result.push({ label: days[d.getDay()], total });
  }
  return result;
}

function buildMonthlySeries(ventasFecha: { fecha: string; total: number }[]) {
  const now = new Date();
  const result: { label: string; total: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const total = ventasFecha
      .filter((v) => {
        const vd = new Date(v.fecha);
        return vd.getFullYear() === d.getFullYear() && vd.getMonth() === d.getMonth();
      })
      .reduce((sum, v) => sum + v.total, 0);
    result.push({
      label: d.toLocaleDateString("es-MX", { month: "short" }),
      total,
    });
  }
  return result;
}

export function FinanzasTab() {
  const ventas = useStore((s) => s.ventas);
  const llenados = useStore((s) => s.llenados);
  const gastos = useStore((s) => s.gastos);
  const [period, setPeriod] = React.useState<"semanal" | "mensual">("semanal");
  const [gastoOpen, setGastoOpen] = React.useState(false);

  const ingresosMes = ventas.filter((v) => isSameMonth(v.fecha)).reduce((s, v) => s + v.total, 0);
  const gastoLlenadosMes = llenados
    .filter((l) => isSameMonth(l.fecha))
    .reduce((s, l) => s + l.total, 0);
  const gastoCombustibleMes = gastos
    .filter((g) => isSameMonth(g.fecha))
    .reduce((s, g) => s + g.monto, 0);
  const gastosMes = gastoLlenadosMes + gastoCombustibleMes;
  const utilidadMes = ingresosMes - gastosMes;

  const series = period === "semanal" ? buildWeeklySeries(ventas) : buildMonthlySeries(ventas);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2.5">
        <Stat label="Ingresos del mes" value={formatMoney(ingresosMes)} tone="success" />
        <Stat label="Gastos del mes" value={formatMoney(gastosMes)} tone="danger" />
        <Stat label="Utilidad neta" value={formatMoney(utilidadMes)} />
        <Stat label="Disponible p/ reinversión" value={formatMoney(Math.max(0, utilidadMes))} />
      </div>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[13px] font-semibold text-ink-muted">Progreso de ventas</p>
          <Tabs value={period} onValueChange={(v) => setPeriod(v as "semanal" | "mensual")}>
            <TabsList className="h-9 p-1">
              <TabsTrigger value="semanal" className="h-7 px-3 text-xs">
                Semanal
              </TabsTrigger>
              <TabsTrigger value="mensual" className="h-7 px-3 text-xs">
                Mensual
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={series} margin={{ left: -20, right: 4, top: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={44} />
              <RechartsTooltip
                formatter={(value: number) => formatMoney(value)}
                contentStyle={{
                  borderRadius: 12,
                  border: "none",
                  fontSize: 12,
                  boxShadow: "0 8px 24px rgba(10,42,67,0.18)",
                }}
              />
              <Bar dataKey="total" fill="#1E6FA8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <p className="mb-2 text-[13px] font-semibold text-ink-muted">Corte de mes</p>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-ink-muted">Ventas registradas</span>
            <span className="font-medium text-ink">
              {ventas.filter((v) => isSameMonth(v.fecha)).length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">Gasto en llenados</span>
            <span className="font-medium text-ink">{formatMoney(gastoLlenadosMes)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">Gasto en combustible</span>
            <span className="font-medium text-ink">{formatMoney(gastoCombustibleMes)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-1.5">
            <span className="text-ink-muted">Utilidad neta</span>
            <span className="font-semibold text-ink">{formatMoney(utilidadMes)}</span>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button size="sm" variant="outline" onClick={() => setGastoOpen(true)}>
          <Fuel className="h-4 w-4" />
          Registrar combustible
        </Button>
      </div>

      <GastoModal open={gastoOpen} onOpenChange={setGastoOpen} />
    </div>
  );
}
