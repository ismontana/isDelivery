"use client";

import dynamic from "next/dynamic";
import { PageHeader } from "@/components/shared/PageHeader";

const MapView = dynamic(() => import("@/features/map/MapView").then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-card bg-black/5 dark:bg-white/5" />
  ),
});

export default function MapPage() {
  return (
    <div
      className="flex flex-col"
      style={{ height: "calc(100dvh - var(--header-top-pad) - var(--tabbar-height))" }}
    >
      <PageHeader title="Mapa" subtitle="Clientes y prospectos en ruta" className="shrink-0" />
      <div className="min-h-0 flex-1 px-3 pb-3">
        <MapView />
      </div>
    </div>
  );
}
