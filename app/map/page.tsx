"use client";

import dynamic from "next/dynamic";
import { PageHeader } from "@/components/shared/PageHeader";

const MapView = dynamic(() => import("@/features/map/MapView").then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div className="h-[calc(100dvh-8.5rem)] w-full animate-pulse rounded-card bg-black/5 dark:bg-white/5" />
  ),
});

export default function MapPage() {
  return (
    <div>
      <PageHeader title="Mapa" subtitle="Clientes y prospectos en ruta" />
      <div className="px-3">
        <MapView />
      </div>
    </div>
  );
}
