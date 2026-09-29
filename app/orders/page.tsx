"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { PageTransition } from "@/components/shared/PageTransition";
import { GlassButton } from "@/components/shared/GlassButton";
import { OrdersList } from "@/features/orders/OrdersList";
import { OrderModal } from "@/features/clients/OrderModal";
import { useStore } from "@/store/useStore";

export default function OrdersPage() {
  const pedidos = useStore((s) => s.pedidos);
  const [addOpen, setAddOpen] = React.useState(false);

  return (
    <PageTransition>
      <PageHeader title="Pedidos" subtitle={`${pedidos.length} pendientes`} />
      <div className="pb-6">
        <OrdersList />
      </div>

      <div
        className="fixed right-5 z-30"
        style={{ bottom: "calc(var(--tabbar-height) + 1rem)" }}
      >
        <GlassButton
          size="icon"
          variant="primary"
          className="h-14 w-14 shadow-glass"
          aria-label="Agregar pedido"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="h-6 w-6" />
        </GlassButton>
      </div>

      <OrderModal open={addOpen} onOpenChange={setAddOpen} />
    </PageTransition>
  );
}
