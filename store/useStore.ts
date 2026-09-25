"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuid } from "uuid";
import type {
  Cliente,
  DeudaRow,
  EnvaseDefault,
  Gasto,
  Llenado,
  Municipio,
  Pedido,
  Prestamo,
  Purificadora,
  Stock,
  StockMovimiento,
  StockMovimientoTipo,
  ThemeMode,
  Venta,
} from "@/types";
import {
  seedClientes,
  seedEnvaseDefault,
  seedGastos,
  seedLlenados,
  seedMunicipios,
  seedPedidos,
  seedPrestamos,
  seedPurificadoras,
  seedStock,
  seedStockMovimientos,
  seedVentas,
} from "./seed";
import { todayISO } from "@/lib/format";

export interface NuevaVentaInput {
  clienteId: string;
  fecha: string;
  cantidad20: number;
  cantidad10: number;
  precio20: number;
  precio10: number;
  incluyeEnvase: boolean;
  envase20Cantidad: number;
  envase10Cantidad: number;
  precioEnvase20: number;
  precioEnvase10: number;
  estadoPago: "pagado" | "fiado";
  pedidoOrigenId?: string;
}

export interface NuevoPrestamoInput {
  clienteId: string;
  fecha: string;
  envase20: number;
  envase10: number;
  liquido20: number;
  liquido10: number;
  aguaPagada: boolean;
  precioLiquido20: number;
  precioLiquido10: number;
}

interface AppState {
  hydrated: boolean;
  theme: ThemeMode;

  clientes: Cliente[];
  pedidos: Pedido[];
  ventas: Venta[];
  prestamos: Prestamo[];
  purificadoras: Purificadora[];
  llenados: Llenado[];
  municipios: Municipio[];
  gastos: Gasto[];
  stock: Stock;
  movimientos: StockMovimiento[];
  envaseDefault: EnvaseDefault;

  setHydrated: () => void;
  toggleTheme: () => void;
  setTheme: (t: ThemeMode) => void;

  // Clientes
  addCliente: (c: Omit<Cliente, "id" | "createdAt" | "deuda">) => Cliente;
  updateCliente: (id: string, patch: Partial<Cliente>) => void;
  deleteCliente: (id: string) => void;

  // Pedidos
  addPedido: (p: Omit<Pedido, "id" | "createdAt" | "estado">) => void;
  deletePedido: (id: string) => void;
  completarPedido: (pedidoId: string, venta: NuevaVentaInput) => void;

  // Ventas
  addVenta: (v: NuevaVentaInput) => void;
  abonarVenta: (ventaId: string, monto: number) => void;
  liquidarVenta: (ventaId: string) => void;

  // Préstamos
  addPrestamo: (p: NuevoPrestamoInput) => void;
  abonarPrestamoLiquido: (prestamoId: string, monto: number) => void;
  liquidarPrestamoLiquido: (prestamoId: string) => void;
  abonarPrestamoEnvase: (
    prestamoId: string,
    tamano: "20L" | "10L",
    cantidad: number
  ) => void;
  liquidarPrestamoEnvase: (prestamoId: string, tamano: "20L" | "10L") => void;

  // Purificadoras
  addPurificadora: (p: Omit<Purificadora, "id">) => void;
  updatePurificadora: (id: string, patch: Partial<Purificadora>) => void;
  deletePurificadora: (id: string) => void;

  // Llenados
  addLlenado: (l: Omit<Llenado, "id" | "total">) => void;

  // Municipios
  addMunicipio: (m: Omit<Municipio, "id">) => void;
  updateMunicipio: (id: string, patch: Partial<Municipio>) => void;
  deleteMunicipio: (id: string) => void;

  // Gastos
  addGasto: (g: Omit<Gasto, "id">) => void;

  // Ajustes globales
  updateEnvaseDefault: (patch: Partial<EnvaseDefault>) => void;

  // Stock
  registrarCompraStock: (
    tamano: "20L" | "10L",
    cantidad: number,
    nota: string
  ) => void;
  registrarRotoStock: (
    tamano: "20L" | "10L",
    cantidad: number,
    nota: string
  ) => void;

  // Import/Export
  exportData: () => string;
  importData: (json: string) => boolean;
  resetDemo: () => void;

  // Selectors (derived, computed each call)
  getCliente: (id: string) => Cliente | undefined;
  getDeudas: () => DeudaRow[];
}

function applyStockDelta(
  stock: Stock,
  tamano: "20L" | "10L",
  propioDelta: number,
  enPoderDelta: number
): Stock {
  if (tamano === "20L") {
    return {
      ...stock,
      propio20: Math.max(0, stock.propio20 + propioDelta),
      enPoderClientes20: Math.max(0, stock.enPoderClientes20 + enPoderDelta),
    };
  }
  return {
    ...stock,
    propio10: Math.max(0, stock.propio10 + propioDelta),
    enPoderClientes10: Math.max(0, stock.enPoderClientes10 + enPoderDelta),
  };
}

function pushMovimiento(
  movimientos: StockMovimiento[],
  tipo: StockMovimientoTipo,
  tamano: "20L" | "10L",
  cantidad: number,
  nota: string
): StockMovimiento[] {
  if (cantidad === 0) return movimientos;
  const mov: StockMovimiento = {
    id: uuid(),
    fecha: todayISO(),
    tipo,
    tamano,
    cantidad,
    nota,
  };
  return [mov, ...movimientos];
}

function buildInitialSeed() {
  const municipios = seedMunicipios();
  const purificadoras = seedPurificadoras();
  const clientes = seedClientes(municipios);
  const pedidos = seedPedidos(clientes);
  const ventas = seedVentas(clientes);
  const prestamos = seedPrestamos(clientes);
  const llenados = seedLlenados(purificadoras);
  const gastos = seedGastos();
  const stock = seedStock();
  const movimientos = seedStockMovimientos();
  const envaseDefault = seedEnvaseDefault();

  // Apply deuda from seeded fiado ventas + prestamos onto clientes
  const clientesConDeuda = clientes.map((c) => {
    let deuda = 0;
    ventas
      .filter((v) => v.clienteId === c.id)
      .forEach((v) => (deuda += v.montoPendiente));
    prestamos
      .filter((p) => p.clienteId === c.id)
      .forEach((p) => (deuda += p.montoLiquidoPendiente));
    return { ...c, deuda };
  });

  return {
    municipios,
    purificadoras,
    clientes: clientesConDeuda,
    pedidos,
    ventas,
    prestamos,
    llenados,
    gastos,
    stock,
    movimientos,
    envaseDefault,
  };
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      theme: "light",
      ...buildInitialSeed(),

      setHydrated: () => set({ hydrated: true }),
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
      setTheme: (t) => set({ theme: t }),

      addCliente: (c) => {
        const nuevo: Cliente = {
          ...c,
          id: uuid(),
          deuda: 0,
          createdAt: todayISO(),
        };
        set((s) => ({ clientes: [nuevo, ...s.clientes] }));
        return nuevo;
      },
      updateCliente: (id, patch) =>
        set((s) => ({
          clientes: s.clientes.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),
      deleteCliente: (id) =>
        set((s) => ({
          clientes: s.clientes.filter((c) => c.id !== id),
          pedidos: s.pedidos.filter((p) => p.clienteId !== id),
        })),

      addPedido: (p) =>
        set((s) => ({
          pedidos: [
            { ...p, id: uuid(), estado: "pendiente", createdAt: todayISO() },
            ...s.pedidos,
          ],
        })),
      deletePedido: (id) =>
        set((s) => ({ pedidos: s.pedidos.filter((p) => p.id !== id) })),

      completarPedido: (pedidoId, ventaInput) => {
        get().addVenta({ ...ventaInput, pedidoOrigenId: pedidoId });
        set((s) => ({ pedidos: s.pedidos.filter((p) => p.id !== pedidoId) }));
      },

      addVenta: (v) => {
        const totalAgua = v.cantidad20 * v.precio20 + v.cantidad10 * v.precio10;
        const totalEnvase = v.incluyeEnvase
          ? v.envase20Cantidad * v.precioEnvase20 +
            v.envase10Cantidad * v.precioEnvase10
          : 0;
        const total = totalAgua + totalEnvase;
        const montoPendiente = v.estadoPago === "fiado" ? total : 0;

        const venta: Venta = {
          id: uuid(),
          clienteId: v.clienteId,
          fecha: v.fecha,
          cantidad20: v.cantidad20,
          cantidad10: v.cantidad10,
          precio20: v.precio20,
          precio10: v.precio10,
          incluyeEnvase: v.incluyeEnvase,
          envase20Cantidad: v.envase20Cantidad,
          envase10Cantidad: v.envase10Cantidad,
          precioEnvase20: v.precioEnvase20,
          precioEnvase10: v.precioEnvase10,
          estadoPago: v.estadoPago,
          total,
          montoPendiente,
          pedidoOrigenId: v.pedidoOrigenId,
        };

        set((s) => {
          let stock = s.stock;
          let movimientos = s.movimientos;
          if (v.incluyeEnvase) {
            if (v.envase20Cantidad > 0) {
              stock = applyStockDelta(stock, "20L", -v.envase20Cantidad, v.envase20Cantidad);
              movimientos = pushMovimiento(
                movimientos,
                "venta",
                "20L",
                -v.envase20Cantidad,
                "Envase vendido con garrafón"
              );
            }
            if (v.envase10Cantidad > 0) {
              stock = applyStockDelta(stock, "10L", -v.envase10Cantidad, v.envase10Cantidad);
              movimientos = pushMovimiento(
                movimientos,
                "venta",
                "10L",
                -v.envase10Cantidad,
                "Envase vendido con garrafón"
              );
            }
          }
          return {
            ventas: [venta, ...s.ventas],
            stock,
            movimientos,
            clientes: s.clientes.map((c) =>
              c.id === v.clienteId ? { ...c, deuda: c.deuda + montoPendiente } : c
            ),
          };
        });
      },

      abonarVenta: (ventaId, monto) =>
        set((s) => {
          const venta = s.ventas.find((v) => v.id === ventaId);
          if (!venta || monto <= 0) return s;
          const abono = Math.min(monto, venta.montoPendiente);
          return {
            ventas: s.ventas.map((v) =>
              v.id === ventaId
                ? {
                    ...v,
                    montoPendiente: v.montoPendiente - abono,
                    estadoPago: v.montoPendiente - abono <= 0 ? "pagado" : v.estadoPago,
                  }
                : v
            ),
            clientes: s.clientes.map((c) =>
              c.id === venta.clienteId ? { ...c, deuda: Math.max(0, c.deuda - abono) } : c
            ),
          };
        }),

      liquidarVenta: (ventaId) => {
        const venta = get().ventas.find((v) => v.id === ventaId);
        if (!venta) return;
        get().abonarVenta(ventaId, venta.montoPendiente);
      },

      addPrestamo: (p) => {
        const totalContenedores20 = p.envase20 + p.liquido20;
        const totalContenedores10 = p.envase10 + p.liquido10;
        const montoLiquidoPendiente = p.aguaPagada
          ? 0
          : p.liquido20 * p.precioLiquido20 + p.liquido10 * p.precioLiquido10;

        const prestamo: Prestamo = {
          id: uuid(),
          clienteId: p.clienteId,
          fecha: p.fecha,
          envase20: p.envase20,
          envase10: p.envase10,
          liquido20: p.liquido20,
          liquido10: p.liquido10,
          aguaPagada: p.aguaPagada,
          precioLiquido20: p.precioLiquido20,
          precioLiquido10: p.precioLiquido10,
          montoLiquidoPendiente,
          envase20Pendiente: totalContenedores20,
          envase10Pendiente: totalContenedores10,
        };

        set((s) => {
          let stock = s.stock;
          let movimientos = s.movimientos;
          if (totalContenedores20 > 0) {
            stock = applyStockDelta(stock, "20L", -totalContenedores20, totalContenedores20);
            movimientos = pushMovimiento(
              movimientos,
              "prestamo_salida",
              "20L",
              -totalContenedores20,
              "Préstamo a cliente"
            );
          }
          if (totalContenedores10 > 0) {
            stock = applyStockDelta(stock, "10L", -totalContenedores10, totalContenedores10);
            movimientos = pushMovimiento(
              movimientos,
              "prestamo_salida",
              "10L",
              -totalContenedores10,
              "Préstamo a cliente"
            );
          }
          return {
            prestamos: [prestamo, ...s.prestamos],
            stock,
            movimientos,
            clientes: s.clientes.map((c) =>
              c.id === p.clienteId
                ? { ...c, deuda: c.deuda + montoLiquidoPendiente }
                : c
            ),
          };
        });
      },

      abonarPrestamoLiquido: (prestamoId, monto) =>
        set((s) => {
          const prestamo = s.prestamos.find((p) => p.id === prestamoId);
          if (!prestamo || monto <= 0) return s;
          const abono = Math.min(monto, prestamo.montoLiquidoPendiente);
          return {
            prestamos: s.prestamos.map((p) =>
              p.id === prestamoId
                ? { ...p, montoLiquidoPendiente: p.montoLiquidoPendiente - abono }
                : p
            ),
            clientes: s.clientes.map((c) =>
              c.id === prestamo.clienteId
                ? { ...c, deuda: Math.max(0, c.deuda - abono) }
                : c
            ),
          };
        }),

      liquidarPrestamoLiquido: (prestamoId) => {
        const prestamo = get().prestamos.find((p) => p.id === prestamoId);
        if (!prestamo) return;
        get().abonarPrestamoLiquido(prestamoId, prestamo.montoLiquidoPendiente);
      },

      abonarPrestamoEnvase: (prestamoId, tamano, cantidad) =>
        set((s) => {
          const prestamo = s.prestamos.find((p) => p.id === prestamoId);
          if (!prestamo || cantidad <= 0) return s;
          const campo = tamano === "20L" ? "envase20Pendiente" : "envase10Pendiente";
          const devueltos = Math.min(cantidad, prestamo[campo]);
          if (devueltos <= 0) return s;
          const stock = applyStockDelta(s.stock, tamano, devueltos, -devueltos);
          const movimientos = pushMovimiento(
            s.movimientos,
            "prestamo_regreso",
            tamano,
            devueltos,
            "Envase recogido de préstamo"
          );
          return {
            prestamos: s.prestamos.map((p) =>
              p.id === prestamoId ? { ...p, [campo]: p[campo] - devueltos } : p
            ),
            stock,
            movimientos,
          };
        }),

      liquidarPrestamoEnvase: (prestamoId, tamano) => {
        const prestamo = get().prestamos.find((p) => p.id === prestamoId);
        if (!prestamo) return;
        const pendiente =
          tamano === "20L" ? prestamo.envase20Pendiente : prestamo.envase10Pendiente;
        get().abonarPrestamoEnvase(prestamoId, tamano, pendiente);
      },

      addPurificadora: (p) =>
        set((s) => ({ purificadoras: [{ ...p, id: uuid() }, ...s.purificadoras] })),
      updatePurificadora: (id, patch) =>
        set((s) => ({
          purificadoras: s.purificadoras.map((p) =>
            p.id === id ? { ...p, ...patch } : p
          ),
        })),
      deletePurificadora: (id) =>
        set((s) => ({
          purificadoras: s.purificadoras.filter((p) => p.id !== id),
        })),

      addLlenado: (l) =>
        set((s) => ({
          llenados: [
            {
              ...l,
              id: uuid(),
              total: l.cantidad20 * l.precio20 + l.cantidad10 * l.precio10,
            },
            ...s.llenados,
          ],
        })),

      addMunicipio: (m) =>
        set((s) => ({ municipios: [{ ...m, id: uuid() }, ...s.municipios] })),
      updateMunicipio: (id, patch) =>
        set((s) => ({
          municipios: s.municipios.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        })),
      deleteMunicipio: (id) =>
        set((s) => ({ municipios: s.municipios.filter((m) => m.id !== id) })),

      addGasto: (g) =>
        set((s) => ({ gastos: [{ ...g, id: uuid() }, ...s.gastos] })),

      updateEnvaseDefault: (patch) =>
        set((s) => ({ envaseDefault: { ...s.envaseDefault, ...patch } })),

      registrarCompraStock: (tamano, cantidad, nota) =>
        set((s) => {
          if (cantidad <= 0) return s;
          const stock = applyStockDelta(s.stock, tamano, cantidad, 0);
          const movimientos = pushMovimiento(
            s.movimientos,
            "compra",
            tamano,
            cantidad,
            nota || "Compra de garrafones nuevos"
          );
          return { stock, movimientos };
        }),

      registrarRotoStock: (tamano, cantidad, nota) =>
        set((s) => {
          if (cantidad <= 0) return s;
          const stock = applyStockDelta(s.stock, tamano, -cantidad, 0);
          const movimientos = pushMovimiento(
            s.movimientos,
            "roto",
            tamano,
            -cantidad,
            nota || "Garrafones rotos"
          );
          return { stock, movimientos };
        }),

      exportData: () => {
        const s = get();
        const payload = {
          version: 1,
          exportedAt: todayISO(),
          clientes: s.clientes,
          pedidos: s.pedidos,
          ventas: s.ventas,
          prestamos: s.prestamos,
          purificadoras: s.purificadoras,
          llenados: s.llenados,
          municipios: s.municipios,
          gastos: s.gastos,
          stock: s.stock,
          movimientos: s.movimientos,
          envaseDefault: s.envaseDefault,
          theme: s.theme,
        };
        return JSON.stringify(payload, null, 2);
      },

      importData: (json) => {
        try {
          const data = JSON.parse(json);
          if (!data || typeof data !== "object") return false;
          set((s) => ({
            clientes: data.clientes ?? s.clientes,
            pedidos: data.pedidos ?? s.pedidos,
            ventas: data.ventas ?? s.ventas,
            prestamos: data.prestamos ?? s.prestamos,
            purificadoras: data.purificadoras ?? s.purificadoras,
            llenados: data.llenados ?? s.llenados,
            municipios: data.municipios ?? s.municipios,
            gastos: data.gastos ?? s.gastos,
            stock: data.stock ?? s.stock,
            movimientos: data.movimientos ?? s.movimientos,
            envaseDefault: data.envaseDefault ?? s.envaseDefault,
            theme: data.theme ?? s.theme,
          }));
          return true;
        } catch {
          return false;
        }
      },

      resetDemo: () => set({ ...buildInitialSeed() }),

      getCliente: (id) => get().clientes.find((c) => c.id === id),

      getDeudas: () => {
        const s = get();
        const rows: DeudaRow[] = [];
        s.ventas
          .filter((v) => v.montoPendiente > 0)
          .forEach((v) => {
            const cliente = s.clientes.find((c) => c.id === v.clienteId);
            rows.push({
              id: `venta-${v.id}`,
              origenId: v.id,
              origenTipo: "venta",
              clienteId: v.clienteId,
              clienteNombre: cliente?.nombre ?? "Cliente eliminado",
              tipo: "venta_fiada",
              tamano: v.cantidad20 > 0 && v.cantidad10 > 0 ? "mixto" : v.cantidad20 > 0 ? "20L" : "10L",
              cantidad: v.cantidad20 + v.cantidad10,
              fecha: v.fecha,
              montoAdeudado: v.montoPendiente,
            });
          });
        s.prestamos.forEach((p) => {
          const cliente = s.clientes.find((c) => c.id === p.clienteId);
          if (p.montoLiquidoPendiente > 0) {
            rows.push({
              id: `prestamo-liquido-${p.id}`,
              origenId: p.id,
              origenTipo: "prestamo",
              clienteId: p.clienteId,
              clienteNombre: cliente?.nombre ?? "Cliente eliminado",
              tipo: "liquido",
              tamano: p.liquido20 > 0 && p.liquido10 > 0 ? "mixto" : p.liquido20 > 0 ? "20L" : "10L",
              cantidad: p.liquido20 + p.liquido10,
              fecha: p.fecha,
              montoAdeudado: p.montoLiquidoPendiente,
            });
          }
          if (p.envase20Pendiente > 0) {
            rows.push({
              id: `prestamo-envase20-${p.id}`,
              origenId: p.id,
              origenTipo: "prestamo",
              clienteId: p.clienteId,
              clienteNombre: cliente?.nombre ?? "Cliente eliminado",
              tipo: "envase",
              tamano: "20L",
              cantidad: p.envase20Pendiente,
              fecha: p.fecha,
              montoAdeudado: 0,
            });
          }
          if (p.envase10Pendiente > 0) {
            rows.push({
              id: `prestamo-envase10-${p.id}`,
              origenId: p.id,
              origenTipo: "prestamo",
              clienteId: p.clienteId,
              clienteNombre: cliente?.nombre ?? "Cliente eliminado",
              tipo: "envase",
              tamano: "10L",
              cantidad: p.envase10Pendiente,
              fecha: p.fecha,
              montoAdeudado: 0,
            });
          }
        });
        return rows.sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
      },
    }),
    {
      name: "isdelivery-storage",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => {
        const { getCliente, getDeudas, ...rest } = s;
        return rest;
      },
    }
  )
);
