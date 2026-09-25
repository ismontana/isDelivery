"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { PageTransition } from "@/components/shared/PageTransition";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { VentasTab } from "@/features/sales/VentasTab";
import { LlenadosTab } from "@/features/sales/LlenadosTab";
import { DeudasTab } from "@/features/sales/DeudasTab";
import { FinanzasTab } from "@/features/sales/FinanzasTab";

export default function SalesPage() {
  return (
    <PageTransition>
      <PageHeader title="Ventas" subtitle="Ventas, llenados, deudas y finanzas" />
      <div className="px-4 pb-6">
        <Tabs defaultValue="ventas">
          <TabsList className="w-full justify-between">
            <TabsTrigger value="ventas" className="flex-1">
              Ventas
            </TabsTrigger>
            <TabsTrigger value="llenados" className="flex-1">
              Llenados
            </TabsTrigger>
            <TabsTrigger value="deudas" className="flex-1">
              Deudas
            </TabsTrigger>
            <TabsTrigger value="finanzas" className="flex-1">
              Finanzas
            </TabsTrigger>
          </TabsList>
          <TabsContent value="ventas">
            <VentasTab />
          </TabsContent>
          <TabsContent value="llenados">
            <LlenadosTab />
          </TabsContent>
          <TabsContent value="deudas">
            <DeudasTab />
          </TabsContent>
          <TabsContent value="finanzas">
            <FinanzasTab />
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
}
