"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { PageTransition } from "@/components/shared/PageTransition";
import { useAuthStore } from "@/store/useAuthStore";
import { CuentaSection } from "@/features/settings/CuentaSection";
import { MiNegocioSection } from "@/features/settings/MiNegocioSection";
import { RepartidoresSection } from "@/features/settings/RepartidoresSection";
import { PrestamosConfigSection } from "@/features/settings/PrestamosConfigSection";
import { AppearanceSection } from "@/features/settings/AppearanceSection";
import { PurificadorasSection } from "@/features/settings/PurificadorasSection";
import { MunicipiosSection } from "@/features/settings/MunicipiosSection";
import { EnvaseDefaultSection } from "@/features/settings/EnvaseDefaultSection";
import { InventarioSection } from "@/features/settings/InventarioSection";
import { ExportImportSection } from "@/features/settings/ExportImportSection";

export default function SettingsPage() {
  const currentUser = useAuthStore((s) => s.getCurrentUser());
  const isAdmin = currentUser?.rol === "admin";

  return (
    <PageTransition>
      <PageHeader title="Ajustes" subtitle="Configuración de la app y del negocio" />
      <div className="space-y-6 px-4 pb-6">
        <CuentaSection />

        {isAdmin && currentUser?.negocioId && (
          <>
            <MiNegocioSection negocioId={currentUser.negocioId} />
            <RepartidoresSection negocioId={currentUser.negocioId} />
            <PrestamosConfigSection />
          </>
        )}

        <AppearanceSection />
        <PurificadorasSection />
        <MunicipiosSection />
        <EnvaseDefaultSection />
        <InventarioSection />
        <ExportImportSection />
      </div>
    </PageTransition>
  );
}
