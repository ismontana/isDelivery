"use client";

import { Moon, Sun } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useStore } from "@/store/useStore";

export function AppearanceSection() {
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);

  return (
    <Card>
      <p className="mb-3 text-[13px] font-semibold text-ink-muted">Apariencia</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-accent/10 text-primary-accent">
            {theme === "dark" ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
          </div>
          <div>
            <p className="text-sm font-medium text-ink">Tema oscuro</p>
            <p className="text-xs text-ink-muted">
              {theme === "dark" ? "Activado" : "Desactivado"}
            </p>
          </div>
        </div>
        <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
      </div>
    </Card>
  );
}
