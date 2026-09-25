"use client";

import type { Nexo } from "@/types";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const NEXO_OPTIONS: { value: Nexo; className: string; hint: string }[] = [
  { value: "rojo", className: "bg-nexo-rojo", hint: "Tratar con cuidado" },
  { value: "amarillo", className: "bg-nexo-amarillo", hint: "Neutral" },
  { value: "verde", className: "bg-nexo-verde", hint: "Tranquilo" },
];

export function NexoDot({ value, size = "md" }: { value: Nexo; size?: "sm" | "md" }) {
  const dot: Record<Nexo, string> = {
    rojo: "bg-nexo-rojo",
    amarillo: "bg-nexo-amarillo",
    verde: "bg-nexo-verde",
  };
  return (
    <span
      className={cn(
        "inline-block rounded-full",
        size === "sm" ? "h-2 w-2" : "h-3 w-3",
        dot[value]
      )}
    />
  );
}

export function NexoSelector({
  value,
  onChange,
}: {
  value: Nexo;
  onChange: (v: Nexo) => void;
}) {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-3">
        {NEXO_OPTIONS.map((opt) => (
          <Tooltip key={opt.value}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => onChange(opt.value)}
                aria-label={opt.hint}
                className={cn(
                  "tap-target flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all",
                  value === opt.value
                    ? "border-ink scale-105"
                    : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <span className={cn("h-5 w-5 rounded-full", opt.className)} />
              </button>
            </TooltipTrigger>
            <TooltipContent>{opt.hint}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
