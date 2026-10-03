import type { Configuracion, Pedido, Venta } from "@/types";

export type ActividadTono = "verde" | "amarillo" | "rojo" | "gris";

/** Días desde la venta o pedido más reciente del cliente (lo que sea más
 * nuevo). null si el cliente nunca ha tenido venta ni pedido. Reemplaza al
 * antiguo campo manual "Nexo": ahora es un dato objetivo derivado de la
 * actividad real, no una etiqueta subjetiva. */
export function diasDesdeUltimaActividad(
  clienteId: string,
  ventas: Venta[],
  pedidos: Pedido[]
): number | null {
  let masReciente: string | null = null;
  for (const v of ventas) {
    if (v.clienteId === clienteId && (!masReciente || v.fecha > masReciente)) {
      masReciente = v.fecha;
    }
  }
  for (const p of pedidos) {
    if (p.clienteId === clienteId && (!masReciente || p.fecha > masReciente)) {
      masReciente = p.fecha;
    }
  }
  if (!masReciente) return null;
  const diffMs = Date.now() - new Date(masReciente).getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

export function actividadTono(dias: number | null): ActividadTono {
  if (dias === null) return "gris";
  if (dias <= 7) return "verde";
  if (dias <= 21) return "amarillo";
  return "rojo";
}

export function actividadEtiqueta(dias: number | null): string {
  if (dias === null) return "Sin actividad";
  if (dias === 0) return "Hoy";
  if (dias === 1) return "Ayer";
  return `Hace ${dias} días`;
}

/** Texto corto para caber en un badge pequeño (tabla, pin del mapa). */
export function actividadCorta(dias: number | null): string {
  if (dias === null) return "–";
  if (dias >= 100) return "99+";
  return String(dias);
}

const FRECUENCIA_DIAS: Record<Configuracion["comisionRetrasoFrecuencia"], number> = {
  diaria: 1,
  semanal: 7,
  mensual: 30,
};

/** Comisión por atraso acumulada y aún no aplicada para una venta fiada,
 * según la configuración del negocio (monto, frecuencia y días de
 * gracia). Devuelve 0 si la comisión está desactivada o la venta todavía
 * está dentro del periodo de gracia. */
export function calcularComisionAtraso(ventaFecha: string, configuracion: Configuracion): number {
  if (!configuracion.comisionRetrasoHabilitada || configuracion.comisionRetrasoMonto <= 0) {
    return 0;
  }
  const diasTranscurridos = Math.floor(
    (Date.now() - new Date(ventaFecha).getTime()) / (1000 * 60 * 60 * 24)
  );
  const diasAtraso = diasTranscurridos - configuracion.comisionRetrasoDiasGracia;
  if (diasAtraso <= 0) return 0;
  const periodoDias = FRECUENCIA_DIAS[configuracion.comisionRetrasoFrecuencia];
  const periodos = Math.floor(diasAtraso / periodoDias);
  return periodos * configuracion.comisionRetrasoMonto;
}
