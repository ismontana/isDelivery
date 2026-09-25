"use client";

import * as React from "react";
import { Receipt } from "lucide-react";
import { Stat } from "@/components/shared/Stat";
import { EmptyState } from "@/components/shared/EmptyState";
import { DeudaRowItem } from "@/components/shared/DeudaRowItem";
import { Select } from "@/components/ui/select";
import { useStore } from "@/store/useStore";
import { formatMoney } from "@/lib/format";
import type { DeudaRow } from "@/types";

export function DeudasTab() {
  const deudas = useStore((s) => s.getDeudas());
  const [tipo, setTipo] = React.useState<"todos" | DeudaRow["tipo"]>("todos");

  const filtered = tipo === "todos" ? deudas : deudas.filter((d) => d.tipo === tipo);
  const totalDinero = deudas.reduce((sum, d) => sum + d.montoAdeudado, 0);
  const totalEnvases = deudas.filter((d) => d.tipo === "envase").reduce((sum, d) => sum + d.cantidad, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2.5">
        <Stat label="Deuda en dinero" value={formatMoney(totalDinero)} tone="danger" />
        <Stat label="Envases por recoger" value={`${totalEnvases}`} />
      </div>

      <Select
        value={tipo}
        onChange={(e) => setTipo(e.target.value as typeof tipo)}
        className="w-auto min-w-[10rem]"
      >
        <option value="todos">Todas las deudas</option>
        <option value="venta_fiada">Ventas fiadas</option>
        <option value="liquido">Agua prestada</option>
        <option value="envase">Envases por recoger</option>
      </Select>

      {filtered.length === 0 ? (
        <EmptyState icon={<Receipt className="h-6 w-6" />} title="Sin deudas pendientes" description="Todo al corriente" />
      ) : (
        <div className="space-y-2">
          {filtered.map((row) => (
            <DeudaRowItem key={row.id} row={row} />
          ))}
        </div>
      )}
    </div>
  );
}
