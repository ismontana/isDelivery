"use client";

import * as React from "react";
import { Plus, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { GlassButton } from "@/components/shared/GlassButton";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageTransition } from "@/components/shared/PageTransition";
import { useStore } from "@/store/useStore";
import { ClientsFilters, DEFAULT_CLIENT_FILTERS, type ClientFilterState } from "@/features/clients/ClientsFilters";
import { ClientsTable } from "@/features/clients/ClientsTable";
import { ClientDetailSheet } from "@/features/clients/ClientDetailSheet";
import { ClientFormModal } from "@/features/clients/ClientFormModal";
import { diasDesdeUltimaActividad, actividadTono } from "@/lib/actividad";
import type { Cliente } from "@/types";

export default function ClientsPage() {
  const clientes = useStore((s) => s.clientes);
  const ventas = useStore((s) => s.ventas);
  const pedidos = useStore((s) => s.pedidos);
  const [filters, setFilters] = React.useState<ClientFilterState>(DEFAULT_CLIENT_FILTERS);
  const [selected, setSelected] = React.useState<Cliente | null>(null);
  const [addOpen, setAddOpen] = React.useState(false);

  const filtered = React.useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return clientes.filter((c) => {
      if (q && !c.nombre.toLowerCase().includes(q) && !c.telefono.includes(q)) return false;
      if (filters.municipio !== "todos" && c.municipio !== filters.municipio) return false;
      if (filters.tipo !== "todos" && c.tipoCliente !== filters.tipo) return false;
      if (filters.tipoVenta !== "todos" && c.tipoVenta !== filters.tipoVenta) return false;
      if (filters.dia !== "todos" && !c.diasEntrega.includes(filters.dia)) return false;
      if (filters.actividad !== "todos") {
        const dias = diasDesdeUltimaActividad(c.id, ventas, pedidos);
        if (actividadTono(dias) !== filters.actividad) return false;
      }
      return true;
    });
  }, [clientes, ventas, pedidos, filters]);

  return (
    <PageTransition>
      <PageHeader
        title="Clientes"
        subtitle={`${filtered.length} de ${clientes.length}`}
        action={
          <GlassButton size="icon" variant="primary" onClick={() => setAddOpen(true)} aria-label="Agregar cliente">
            <Plus className="h-5 w-5" />
          </GlassButton>
        }
      />
      <ClientsFilters value={filters} onChange={setFilters} />

      <div className="px-4 pb-4 pt-3">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Users className="h-6 w-6" />}
            title="Sin clientes"
            description="Ajusta los filtros o agrega un nuevo cliente"
          />
        ) : (
          <ClientsTable clientes={filtered} onRowClick={setSelected} />
        )}
      </div>

      <ClientDetailSheet
        cliente={selected}
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
      <ClientFormModal open={addOpen} onOpenChange={setAddOpen} />
    </PageTransition>
  );
}
