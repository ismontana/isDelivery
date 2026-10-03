"use client";

import { Search } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { ActividadTono } from "@/lib/actividad";
import type { DiaSemana } from "@/types";
import { DIA_LABEL, DIAS_SEMANA } from "@/types";

export interface ClientFilterState {
  search: string;
  municipio: string;
  tipo: "todos" | "cliente" | "prospecto";
  tipoVenta: "todos" | "mayor" | "menor";
  dia: "todos" | DiaSemana;
  actividad: "todos" | ActividadTono;
}

export const DEFAULT_CLIENT_FILTERS: ClientFilterState = {
  search: "",
  municipio: "todos",
  tipo: "todos",
  tipoVenta: "todos",
  dia: "todos",
  actividad: "todos",
};

export function ClientsFilters({
  value,
  onChange,
}: {
  value: ClientFilterState;
  onChange: (v: ClientFilterState) => void;
}) {
  const municipios = useStore((s) => s.municipios);

  return (
    <div className="space-y-2 px-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <Input
          placeholder="Buscar cliente..."
          value={value.search}
          onChange={(e) => onChange({ ...value, search: e.target.value })}
          className="pl-10"
        />
      </div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        <Select
          value={value.municipio}
          onChange={(e) => onChange({ ...value, municipio: e.target.value })}
          className="w-auto min-w-[8.5rem]"
        >
          <option value="todos">Municipio</option>
          {municipios.map((m) => (
            <option key={m.id} value={m.nombre}>
              {m.nombre}
            </option>
          ))}
        </Select>
        <Select
          value={value.tipo}
          onChange={(e) => onChange({ ...value, tipo: e.target.value as ClientFilterState["tipo"] })}
          className="w-auto min-w-[7.5rem]"
        >
          <option value="todos">Tipo</option>
          <option value="cliente">Clientes</option>
          <option value="prospecto">Prospectos</option>
        </Select>
        <Select
          value={value.tipoVenta}
          onChange={(e) =>
            onChange({ ...value, tipoVenta: e.target.value as ClientFilterState["tipoVenta"] })
          }
          className="w-auto min-w-[7.5rem]"
        >
          <option value="todos">Venta</option>
          <option value="mayor">Mayoreo</option>
          <option value="menor">Menudeo</option>
        </Select>
        <Select
          value={value.dia}
          onChange={(e) => onChange({ ...value, dia: e.target.value as ClientFilterState["dia"] })}
          className="w-auto min-w-[7rem]"
        >
          <option value="todos">Día</option>
          {DIAS_SEMANA.map((d) => (
            <option key={d} value={d}>
              {DIA_LABEL[d]}
            </option>
          ))}
        </Select>
        <Select
          value={value.actividad}
          onChange={(e) =>
            onChange({ ...value, actividad: e.target.value as ClientFilterState["actividad"] })
          }
          className="w-auto min-w-[9rem]"
        >
          <option value="todos">Actividad</option>
          <option value="verde">Reciente (≤7d)</option>
          <option value="amarillo">Moderada (8–21d)</option>
          <option value="rojo">Inactivo (21d+)</option>
          <option value="gris">Sin actividad</option>
        </Select>
      </div>
    </div>
  );
}
