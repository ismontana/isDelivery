"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/store/useStore";

export function EnvaseDefaultSection() {
  const envaseDefault = useStore((s) => s.envaseDefault);
  const updateEnvaseDefault = useStore((s) => s.updateEnvaseDefault);

  return (
    <Card>
      <p className="mb-3 text-[13px] font-semibold text-ink-muted">Precio default de envase</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Envase 20L</Label>
          <Input
            type="number"
            min="0"
            step="1"
            defaultValue={envaseDefault.precio20}
            onBlur={(e) => updateEnvaseDefault({ precio20: Number(e.target.value) })}
          />
        </div>
        <div>
          <Label>Envase 10L</Label>
          <Input
            type="number"
            min="0"
            step="1"
            defaultValue={envaseDefault.precio10}
            onBlur={(e) => updateEnvaseDefault({ precio10: Number(e.target.value) })}
          />
        </div>
      </div>
    </Card>
  );
}
