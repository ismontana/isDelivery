import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { actividadCorta, actividadEtiqueta, actividadTono, type ActividadTono } from "@/lib/actividad";

const TONE_DOT: Record<ActividadTono, string> = {
  verde: "bg-nexo-verde",
  amarillo: "bg-nexo-amarillo",
  rojo: "bg-nexo-rojo",
  gris: "bg-ink-muted/40",
};

const TONE_TEXT: Record<ActividadTono, string> = {
  verde: "text-nexo-verde",
  amarillo: "text-nexo-amarillo",
  rojo: "text-nexo-rojo",
  gris: "text-ink-muted",
};

/** Full badge with dot + "Hace X días" label — client detail sheet, history. */
export function ActividadBadge({ dias, className }: { dias: number | null; className?: string }) {
  const tono = actividadTono(dias);
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", TONE_TEXT[tono], className)}>
      <span className={cn("h-2 w-2 shrink-0 rounded-full", TONE_DOT[tono])} />
      <Clock className="h-3 w-3 shrink-0" />
      {actividadEtiqueta(dias)}
    </span>
  );
}

/** Compact dot for tables. */
export function ActividadDot({ dias, className }: { dias: number | null; className?: string }) {
  const tono = actividadTono(dias);
  return <span className={cn("inline-block h-2.5 w-2.5 rounded-full", TONE_DOT[tono], className)} />;
}

/** Small numeric pill for tight spaces (table cell). */
export function ActividadPill({ dias }: { dias: number | null }) {
  const tono = actividadTono(dias);
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-medium", TONE_TEXT[tono])}>
      <span className={cn("h-2 w-2 rounded-full", TONE_DOT[tono])} />
      {actividadCorta(dias)}d
    </span>
  );
}
