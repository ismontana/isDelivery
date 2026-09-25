"use client";

import * as React from "react";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useStore } from "@/store/useStore";
import { formatMoney } from "@/lib/format";
import type { Municipio } from "@/types";
import { MunicipioModal } from "./MunicipioModal";

export function MunicipiosSection() {
  const municipios = useStore((s) => s.municipios);
  const deleteMunicipio = useStore((s) => s.deleteMunicipio);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Municipio | undefined>();
  const [toDelete, setToDelete] = React.useState<Municipio | null>(null);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold text-ink-muted">Municipios</p>
        <Button
          size="sm"
          variant="glass"
          onClick={() => {
            setEditing(undefined);
            setModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Agregar
        </Button>
      </div>

      {municipios.length === 0 ? (
        <EmptyState icon={<MapPin className="h-6 w-6" />} title="Sin municipios" className="py-6" />
      ) : (
        <div className="space-y-2">
          {municipios.map((m) => (
            <Card key={m.id} className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{m.nombre}</p>
                <p className="text-xs text-ink-muted">
                  {formatMoney(m.precioVenta20)} / 20L · {formatMoney(m.precioVenta10)} / 10L
                </p>
                <p className="text-xs text-ink-muted">
                  Ruta: {m.diasRuta.length > 0 ? m.diasRuta.join(", ") : "sin definir"}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Editar"
                  onClick={() => {
                    setEditing(m);
                    setModalOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Eliminar"
                  onClick={() => setToDelete(m)}
                >
                  <Trash2 className="h-4 w-4 text-danger" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <MunicipioModal open={modalOpen} onOpenChange={setModalOpen} municipio={editing} />
      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Eliminar municipio"
        description={`¿Eliminar "${toDelete?.nombre}"? Los clientes ya registrados conservarán su municipio como texto.`}
        confirmLabel="Eliminar"
        onConfirm={() => {
          if (toDelete) {
            deleteMunicipio(toDelete.id);
            toast.success("Municipio eliminado");
          }
        }}
      />
    </div>
  );
}
