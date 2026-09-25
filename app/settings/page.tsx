import { PageHeader } from "@/components/shared/PageHeader";
import { PageTransition } from "@/components/shared/PageTransition";
import { AppearanceSection } from "@/features/settings/AppearanceSection";
import { PurificadorasSection } from "@/features/settings/PurificadorasSection";
import { MunicipiosSection } from "@/features/settings/MunicipiosSection";
import { EnvaseDefaultSection } from "@/features/settings/EnvaseDefaultSection";
import { InventarioSection } from "@/features/settings/InventarioSection";
import { ExportImportSection } from "@/features/settings/ExportImportSection";

export default function SettingsPage() {
  return (
    <PageTransition>
      <PageHeader title="Ajustes" subtitle="Configuración de la app y del negocio" />
      <div className="space-y-6 px-4 pb-6">
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
