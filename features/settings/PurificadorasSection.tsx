"use client";

import * as React from "react";
import { Plus, Pencil, Trash2, Factory } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useStore } from "@/store/useStore";
import { formatMoney } from "@/lib/format";
import type { Purificadora } from "@/types";
import { PurificadoraModal } from "./PurificadoraModal";
import { toast } from "sonner";

export function PurificadorasSection() {
  const purificadoras = useStore((s) => s.purificadoras);
  const deletePurificadora = useStore((s) => s.deletePurificadora);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Purificadora | undefined>();
  const [toDelete, setToDelete] = React.useState<Purificadora | null>(null);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold text-ink-muted">Purificadoras</p>
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

      {purificadoras.length === 0 ? (
        <EmptyState icon={<Factory className="h-6 w-6" />} title="Sin purificadoras" className="py-6" />
      ) : (
        <div className="space-y-2">
          {purificadoras.map((p) => (
            <Card key={p.id} className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{p.nombre}</p>
                <p className="truncate text-xs text-ink-muted">{p.direccion || "Sin dirección"}</p>
                <p className="text-xs text-ink-muted">
                  {formatMoney(p.precioLlenado20)} / 20L · {formatMoney(p.precioLlenado10)} / 10L
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Editar"
                  onClick={() => {
                    setEditing(p);
                    setModalOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Eliminar"
                  onClick={() => setToDelete(p)}
                >
                  <Trash2 className="h-4 w-4 text-danger" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <PurificadoraModal open={modalOpen} onOpenChange={setModalOpen} purificadora={editing} />
      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Eliminar purificadora"
        description={`¿Eliminar "${toDelete?.nombre}"? Los llenados ya registrados no se verán afectados.`}
        confirmLabel="Eliminar"
        onConfirm={() => {
          if (toDelete) {
            deletePurificadora(toDelete.id);
            toast.success("Purificadora eliminada");
          }
        }}
      />
    </div>
  );
}
