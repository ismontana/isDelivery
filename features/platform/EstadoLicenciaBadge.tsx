import { Badge } from "@/components/ui/badge";
import type { EstadoLicencia } from "@/types/auth";

const CONFIG: Record<EstadoLicencia, { label: string; variant: "success" | "danger" | "neutral" }> = {
  activa: { label: "Activa", variant: "success" },
  vencida: { label: "Vencida", variant: "danger" },
  suspendida: { label: "Suspendida", variant: "danger" },
  cancelada: { label: "Cancelada", variant: "neutral" },
};

export function EstadoLicenciaBadge({ estado }: { estado: EstadoLicencia }) {
  const c = CONFIG[estado];
  return <Badge variant={c.variant}>{c.label}</Badge>;
}
