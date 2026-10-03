"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { NegociosTab } from "@/features/platform/NegociosTab";
import { PlanesTab } from "@/features/platform/PlanesTab";

export default function AdminPlataformaPage() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-semibold tracking-tight text-ink">Panel de plataforma</h1>
        <p className="text-[13px] text-ink-muted">
          Administra los negocios que usan isDelivery y sus licencias
        </p>
      </div>
      <Tabs defaultValue="negocios">
        <TabsList>
          <TabsTrigger value="negocios">Negocios</TabsTrigger>
          <TabsTrigger value="planes">Planes</TabsTrigger>
        </TabsList>
        <TabsContent value="negocios">
          <NegociosTab />
        </TabsContent>
        <TabsContent value="planes">
          <PlanesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
