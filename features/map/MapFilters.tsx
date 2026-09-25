"use client";

import * as React from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Select } from "@/components/ui/select";
import { GlassButton } from "@/components/shared/GlassButton";
import { motion, AnimatePresence } from "framer-motion";

export interface MapFilterState {
  municipio: string;
  tipo: "todos" | "cliente" | "prospecto";
  tipoVenta: "todos" | "mayor" | "menor";
}

export function MapFilters({
  value,
  onChange,
}: {
  value: MapFilterState;
  onChange: (v: MapFilterState) => void;
}) {
  const municipios = useStore((s) => s.municipios);
  const [open, setOpen] = React.useState(false);

  const activeCount =
    (value.municipio !== "todos" ? 1 : 0) +
    (value.tipo !== "todos" ? 1 : 0) +
    (value.tipoVenta !== "todos" ? 1 : 0);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-end">
        <GlassButton
          size="sm"
          variant="glass"
          onClick={() => setOpen((o) => !o)}
          className="gap-1.5"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filtros
          {activeCount > 0 && (
            <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-accent text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </GlassButton>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="glass glass-shadow overflow-hidden rounded-card p-3"
          >
            <div className="grid grid-cols-3 gap-2">
              <Select
                value={value.municipio}
                onChange={(e) => onChange({ ...value, municipio: e.target.value })}
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
                onChange={(e) => onChange({ ...value, tipo: e.target.value as MapFilterState["tipo"] })}
              >
                <option value="todos">Tipo</option>
                <option value="cliente">Clientes</option>
                <option value="prospecto">Prospectos</option>
              </Select>
              <Select
                value={value.tipoVenta}
                onChange={(e) =>
                  onChange({ ...value, tipoVenta: e.target.value as MapFilterState["tipoVenta"] })
                }
              >
                <option value="todos">Venta</option>
                <option value="mayor">Mayoreo</option>
                <option value="menor">Menudeo</option>
              </Select>
            </div>
            {activeCount > 0 && (
              <button
                onClick={() => onChange({ municipio: "todos", tipo: "todos", tipoVenta: "todos" })}
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-ink-muted hover:text-ink"
              >
                <X className="h-3 w-3" /> Limpiar filtros
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
