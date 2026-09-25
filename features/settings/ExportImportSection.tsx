"use client";

import * as React from "react";
import { toast } from "sonner";
import { Download, Upload, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useStore } from "@/store/useStore";

export function ExportImportSection() {
  const exportData = useStore((s) => s.exportData);
  const importData = useStore((s) => s.importData);
  const resetDemo = useStore((s) => s.resetDemo);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [resetOpen, setResetOpen] = React.useState(false);

  function handleExport() {
    const json = exportData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `isdelivery-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success("Datos exportados");
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importData(String(reader.result));
      if (ok) toast.success("Datos importados correctamente");
      else toast.error("El archivo no es válido");
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <Card>
      <p className="mb-3 text-[13px] font-semibold text-ink-muted">Exportar / Importar datos</p>
      <div className="grid grid-cols-2 gap-2">
        <Button size="sm" variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4" />
          Exportar
        </Button>
        <Button size="sm" variant="outline" onClick={handleImportClick}>
          <Upload className="h-4 w-4" />
          Importar
        </Button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        onClick={() => setResetOpen(true)}
        className="mt-3 flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-danger"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Restablecer datos de demostración
      </button>

      <ConfirmDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        title="Restablecer datos"
        description="Se reemplazarán todos los datos actuales por el set de datos de demostración. Esta acción no se puede deshacer."
        confirmLabel="Restablecer"
        onConfirm={() => {
          resetDemo();
          toast.success("Datos restablecidos");
        }}
      />
    </Card>
  );
}
