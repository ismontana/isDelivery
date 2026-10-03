import * as React from "react";
import type { TipoCliente } from "@/types";
import { actividadCorta, actividadTono, type ActividadTono } from "@/lib/actividad";

const TONO_HEX: Record<ActividadTono, string> = {
  rojo: "#D24444",
  amarillo: "#D9A62E",
  verde: "#3F9B62",
  gris: "#9AA5AD",
};

interface PinMarkerProps {
  tipoCliente: TipoCliente;
  dias: number | null;
  size?: number;
}

export function PinMarker({ tipoCliente, dias, size = 34 }: PinMarkerProps) {
  const fill = tipoCliente === "prospecto" ? "#D98A2B" : "#1E6FA8";
  const tono = actividadTono(dias);
  const texto = actividadCorta(dias);
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 34 42" fill="none">
      <path
        d="M17 41C17 41 31 25.6 31 15.5C31 7.49 24.73 1 17 1C9.27 1 3 7.49 3 15.5C3 25.6 17 41 17 41Z"
        fill={fill}
        stroke="white"
        strokeWidth="1.5"
      />
      <circle cx="17" cy="15" r="6.5" fill="white" />
      <circle cx="17" cy="15" r="4.2" fill={fill} />
      <circle cx="26" cy="8" r="7" fill={TONO_HEX[tono]} stroke="white" strokeWidth="1.5" />
      <text
        x="26"
        y="8"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={texto.length > 2 ? "6" : "7.5"}
        fontWeight="700"
        fill="white"
        fontFamily="sans-serif"
      >
        {texto}
      </text>
    </svg>
  );
}

export function pinMarkerHTML(tipoCliente: TipoCliente, dias: number | null): string {
  const fill = tipoCliente === "prospecto" ? "#D98A2B" : "#1E6FA8";
  const tono = actividadTono(dias);
  const texto = actividadCorta(dias);
  const fontSize = texto.length > 2 ? "6" : "7.5";
  return `
    <svg width="34" height="42" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 41C17 41 31 25.6 31 15.5C31 7.49 24.73 1 17 1C9.27 1 3 7.49 3 15.5C3 25.6 17 41 17 41Z" fill="${fill}" stroke="white" stroke-width="1.5"/>
      <circle cx="17" cy="15" r="6.5" fill="white"/>
      <circle cx="17" cy="15" r="4.2" fill="${fill}"/>
      <circle cx="26" cy="8" r="7" fill="${TONO_HEX[tono]}" stroke="white" stroke-width="1.5"/>
      <text x="26" y="8" text-anchor="middle" dominant-baseline="central" font-size="${fontSize}" font-weight="700" fill="white" font-family="sans-serif">${texto}</text>
    </svg>
  `;
}
