"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ClipboardList } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/shared/EmptyState";
import { OrderCard } from "./OrderCard";
import { useStore } from "@/store/useStore";
import { formatDate } from "@/lib/format";

export function OrdersList() {
  const pedidos = useStore((s) => s.pedidos);
  const clientes = useStore((s) => s.clientes);
  const municipios = useStore((s) => s.municipios);

  const [search, setSearch] = React.useState("");
  const [municipio, setMunicipio] = React.useState("todos");
  const [groupBy, setGroupBy] = React.useState<"dia" | "municipio">("dia");

  const enriched = React.useMemo(
    () =>
      pedidos
        .map((p) => ({ pedido: p, cliente: clientes.find((c) => c.id === p.clienteId) }))
        .filter((x): x is { pedido: typeof pedidos[number]; cliente: NonNullable<typeof x.cliente> } => !!x.cliente),
    [pedidos, clientes]
  );

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return enriched.filter(({ cliente }) => {
      if (q && !cliente.nombre.toLowerCase().includes(q)) return false;
      if (municipio !== "todos" && cliente.municipio !== municipio) return false;
      return true;
    });
  }, [enriched, search, municipio]);

  const groups = React.useMemo(() => {
    const map = new Map<string, typeof filtered>();
    filtered.forEach((item) => {
      const key =
        groupBy === "dia" ? formatDate(item.pedido.fecha) : item.cliente.municipio;
      const arr = map.get(key) ?? [];
      arr.push(item);
      map.set(key, arr);
    });
    return Array.from(map.entries());
  }, [filtered, groupBy]);

  return (
    <div className="space-y-4 px-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <Input
          placeholder="Buscar cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex items-center justify-between gap-2">
        <Tabs value={groupBy} onValueChange={(v) => setGroupBy(v as "dia" | "municipio")}>
          <TabsList>
            <TabsTrigger value="dia">Por día</TabsTrigger>
            <TabsTrigger value="municipio">Por municipio</TabsTrigger>
          </TabsList>
        </Tabs>
        <Select
          value={municipio}
          onChange={(e) => setMunicipio(e.target.value)}
          className="w-auto min-w-[8.5rem]"
        >
          <option value="todos">Municipio</option>
          {municipios.map((m) => (
            <option key={m.id} value={m.nombre}>
              {m.nombre}
            </option>
          ))}
        </Select>
      </div>

      {groups.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="h-6 w-6" />}
          title="Sin pedidos"
          description="Los pedidos que agregues aparecerán aquí"
        />
      ) : (
        <div className="space-y-5">
          {groups.map(([key, items]) => (
            <div key={key}>
              <h3 className="mb-2 text-[13px] font-semibold text-ink-muted">{key}</h3>
              <div className="space-y-2.5">
                <AnimatePresence initial={false}>
                  {items.map(({ pedido }) => (
                    <motion.div
                      key={pedido.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                    >
                      <OrderCard pedido={pedido} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
