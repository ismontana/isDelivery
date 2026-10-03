"use client";

import * as React from "react";
import { Plus, Pencil, PackageCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { EmptyState } from "@/components/shared/EmptyState";
import { useAuthStore } from "@/store/useAuthStore";
import { formatMoney } from "@/lib/format";
import type { Plan } from "@/types/auth";
import { PlanModal } from "./PlanModal";

export function PlanesTab() {
  const planes = useAuthStore((s) => s.planes);
  const togglePlanActivo = useAuthStore((s) => s.togglePlanActivo);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Plan | undefined>();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold text-ink-muted">Catálogo de planes</p>
        <Button
          size="sm"
          onClick={() => {
            setEditing(undefined);
            setModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Nuevo plan
        </Button>
      </div>

      {planes.length === 0 ? (
        <EmptyState icon={<PackageCheck className="h-6 w-6" />} title="Sin planes" />
      ) : (
        <div className="space-y-2.5">
          {planes.map((p) => (
            <Card key={p.id} className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">{p.nombre}</p>
                <p className="text-xs text-ink-muted">{p.descripcion}</p>
                <p className="mt-0.5 text-xs text-ink-muted">
                  {formatMoney(p.precioMensual)}/mes · {p.maxRepartidores} repartidores
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
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
                <Switch checked={p.activo} onCheckedChange={() => togglePlanActivo(p.id)} />
              </div>
            </Card>
          ))}
        </div>
      )}

      <PlanModal open={modalOpen} onOpenChange={setModalOpen} plan={editing} />
    </div>
  );
}
