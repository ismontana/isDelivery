"use client";

import { DIAS_SEMANA, DIA_LABEL, type DiaSemana } from "@/types";
import { cn } from "@/lib/utils";

export function DaySelector({
  value,
  onChange,
}: {
  value: DiaSemana[];
  onChange: (v: DiaSemana[]) => void;
}) {
  function toggle(d: DiaSemana) {
    if (value.includes(d)) onChange(value.filter((x) => x !== d));
    else onChange([...value, d]);
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {DIAS_SEMANA.map((d) => {
        const active = value.includes(d);
        return (
          <button
            key={d}
            type="button"
            onClick={() => toggle(d)}
            className={cn(
              "tap-target flex h-9 min-w-[2.75rem] items-center justify-center rounded-capsule border border-border px-2 text-xs font-medium transition-colors",
              active
                ? "border-transparent bg-primary-base text-white"
                : "bg-surface-raised text-ink-muted hover:text-ink"
            )}
          >
            {DIA_LABEL[d]}
          </button>
        );
      })}
    </div>
  );
}
