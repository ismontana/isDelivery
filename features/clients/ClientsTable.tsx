"use client";

import * as React from "react";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { NexoDot } from "@/components/shared/NexoSelector";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useStore } from "@/store/useStore";
import type { Cliente } from "@/types";

export function ClientsTable({
  clientes,
  onRowClick,
}: {
  clientes: Cliente[];
  onRowClick: (c: Cliente) => void;
}) {
  const updateCliente = useStore((s) => s.updateCliente);

  const columns: DataTableColumn<Cliente>[] = [
    {
      key: "nombre",
      header: "Nombre",
      sortValue: (c) => c.nombre.toLowerCase(),
      render: (c) => <span className="font-medium text-ink">{c.nombre}</span>,
    },
    {
      key: "municipio",
      header: "Municipio",
      sortValue: (c) => c.municipio,
      render: (c) => <span className="text-ink-muted">{c.municipio}</span>,
    },
    {
      key: "tipo",
      header: "Tipo",
      sortValue: (c) => c.tipoCliente,
      render: (c) => (
        <Badge variant={c.tipoCliente === "prospecto" ? "prospecto" : "default"}>
          {c.tipoCliente === "prospecto" ? "Prospecto" : "Cliente"}
        </Badge>
      ),
    },
    {
      key: "telefono",
      header: "Teléfono",
      render: (c) => (
        <Input
          defaultValue={c.telefono}
          onClick={(e) => e.stopPropagation()}
          onBlur={(e) => updateCliente(c.id, { telefono: e.target.value })}
          className="h-9 w-32 px-2 text-xs"
        />
      ),
    },
    {
      key: "nexo",
      header: "Nexo",
      render: (c) => <NexoDot value={c.nexo} />,
    },
    {
      key: "precio20",
      header: "20L",
      sortValue: (c) => c.precio20,
      render: (c) => (
        <Input
          type="number"
          defaultValue={c.precio20}
          onClick={(e) => e.stopPropagation()}
          onBlur={(e) => updateCliente(c.id, { precio20: Number(e.target.value) })}
          className="h-9 w-16 px-2 text-xs"
        />
      ),
    },
    {
      key: "precio10",
      header: "10L",
      sortValue: (c) => c.precio10,
      render: (c) => (
        <Input
          type="number"
          defaultValue={c.precio10}
          onClick={(e) => e.stopPropagation()}
          onBlur={(e) => updateCliente(c.id, { precio10: Number(e.target.value) })}
          className="h-9 w-16 px-2 text-xs"
        />
      ),
    },
    {
      key: "dias",
      header: "Días",
      render: (c) => (
        <span className="text-xs text-ink-muted">{c.diasEntrega.join(", ") || "—"}</span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={clientes}
      rowKey={(c) => c.id}
      onRowClick={onRowClick}
      emptyMessage="No hay clientes con estos filtros"
    />
  );
}
