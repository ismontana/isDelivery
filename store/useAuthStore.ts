"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuid } from "uuid";
import type { Licencia, Negocio, Plan, RolUsuario, Usuario } from "@/types/auth";
import {
  seedLicencias,
  seedNegocios,
  seedPlanes,
  seedUsuarios,
} from "./authSeed";

function todayDateISO(): string {
  return new Date().toISOString().slice(0, 10);
}
function nowISO(): string {
  return new Date().toISOString();
}

export interface SignupInput {
  negocioNombre: string;
  tipo: "purificadora" | "independiente";
  propietarioNombre: string;
  email: string;
  telefono: string;
  password: string;
}

export interface CrearRepartidorInput {
  nombre: string;
  email: string;
  telefono: string;
  password: string;
}

interface AuthState {
  hydrated: boolean;
  currentUserId: string | null;

  planes: Plan[];
  negocios: Negocio[];
  licencias: Licencia[];
  usuarios: Usuario[];

  setHydrated: () => void;

  // Sesión
  login: (email: string, password: string) => { ok: boolean; error?: string };
  signup: (data: SignupInput) => { ok: boolean; error?: string };
  logout: () => void;

  // Selectors
  getCurrentUser: () => Usuario | null;
  getCurrentNegocio: () => Negocio | null;
  getLicenciaActiva: (negocioId: string) => Licencia | null;
  getEstadoEfectivo: (licencia: Licencia) => Licencia["estado"];
  getRepartidores: (negocioId: string) => Usuario[];
  getPlan: (planId: string) => Plan | undefined;

  // Admin: gestión de repartidores del propio negocio
  crearRepartidor: (negocioId: string, data: CrearRepartidorInput) => { ok: boolean; error?: string };
  actualizarUsuario: (id: string, patch: Partial<Pick<Usuario, "nombre" | "telefono" | "email">>) => void;
  toggleUsuarioActivo: (id: string) => void;
  eliminarUsuario: (id: string) => void;

  // Super admin: negocios, licencias, planes
  crearNegocioManual: (data: SignupInput) => { ok: boolean; error?: string };
  toggleNegocioActivo: (id: string) => void;
  emitirLicencia: (input: {
    negocioId: string;
    planId: string;
    fechaInicio: string;
    fechaFin: string;
    precioPagado: number;
    notas: string;
  }) => void;
  actualizarEstadoLicencia: (licenciaId: string, estado: Licencia["estado"]) => void;
  addPlan: (p: Omit<Plan, "id" | "createdAt">) => void;
  updatePlan: (id: string, patch: Partial<Plan>) => void;
  togglePlanActivo: (id: string) => void;
}

function buildInitialAuthSeed() {
  const planes = seedPlanes();
  const negocios = seedNegocios();
  const licencias = seedLicencias(negocios, planes);
  const usuarios = seedUsuarios(negocios);
  return { planes, negocios, licencias, usuarios };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      currentUserId: null,
      ...buildInitialAuthSeed(),

      setHydrated: () => set({ hydrated: true }),

      login: (email, password) => {
        const usuario = get().usuarios.find(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase()
        );
        if (!usuario || usuario.password !== password) {
          return { ok: false, error: "Correo o contraseña incorrectos" };
        }
        if (!usuario.activo) {
          return { ok: false, error: "Esta cuenta está desactivada. Contacta a tu administrador." };
        }
        if (usuario.negocioId) {
          const negocio = get().negocios.find((n) => n.id === usuario.negocioId);
          if (negocio && !negocio.activo) {
            return { ok: false, error: "El negocio está suspendido. Contacta a soporte." };
          }
        }
        set((s) => ({
          currentUserId: usuario.id,
          usuarios: s.usuarios.map((u) =>
            u.id === usuario.id ? { ...u, ultimoLoginAt: nowISO() } : u
          ),
        }));
        return { ok: true };
      },

      signup: (data) => {
        const exists = get().usuarios.some(
          (u) => u.email.toLowerCase() === data.email.trim().toLowerCase()
        );
        if (exists) return { ok: false, error: "Ya existe una cuenta con ese correo" };
        if (data.password.length < 6) {
          return { ok: false, error: "La contraseña debe tener al menos 6 caracteres" };
        }

        const negocio: Negocio = {
          id: uuid(),
          nombre: data.negocioNombre,
          tipo: data.tipo,
          propietarioNombre: data.propietarioNombre,
          telefonoContacto: data.telefono,
          emailContacto: data.email,
          activo: true,
          precioEnvase20Default: 80,
          precioEnvase10Default: 60,
          createdAt: nowISO(),
        };

        const planPrueba = get().planes.find((p) => p.nombre === "Prueba gratuita");
        const licencia: Licencia | null = planPrueba
          ? {
              id: uuid(),
              negocioId: negocio.id,
              planId: planPrueba.id,
              estado: "activa",
              fechaInicio: todayDateISO(),
              fechaFin: (() => {
                const d = new Date();
                d.setDate(d.getDate() + 14);
                return d.toISOString().slice(0, 10);
              })(),
              precioPagado: 0,
              notas: "Prueba gratuita generada automáticamente al registrarse",
              emitidaPor: null,
              createdAt: nowISO(),
            }
          : null;

        const admin: Usuario = {
          id: uuid(),
          negocioId: negocio.id,
          rol: "admin",
          nombre: data.propietarioNombre,
          email: data.email,
          password: data.password,
          telefono: data.telefono,
          activo: true,
          ultimoLoginAt: nowISO(),
          createdAt: nowISO(),
        };

        set((s) => ({
          negocios: [negocio, ...s.negocios],
          licencias: licencia ? [licencia, ...s.licencias] : s.licencias,
          usuarios: [admin, ...s.usuarios],
          currentUserId: admin.id,
        }));
        return { ok: true };
      },

      logout: () => set({ currentUserId: null }),

      getCurrentUser: () => {
        const s = get();
        return s.usuarios.find((u) => u.id === s.currentUserId) ?? null;
      },
      getCurrentNegocio: () => {
        const user = get().getCurrentUser();
        if (!user?.negocioId) return null;
        return get().negocios.find((n) => n.id === user.negocioId) ?? null;
      },
      getLicenciaActiva: (negocioId) => {
        const licencias = get()
          .licencias.filter((l) => l.negocioId === negocioId)
          .sort((a, b) => (a.fechaFin < b.fechaFin ? 1 : -1));
        return licencias[0] ?? null;
      },
      getEstadoEfectivo: (licencia) => {
        if (licencia.estado === "cancelada" || licencia.estado === "suspendida") {
          return licencia.estado;
        }
        return licencia.fechaFin < todayDateISO() ? "vencida" : "activa";
      },
      getRepartidores: (negocioId) =>
        get().usuarios.filter((u) => u.negocioId === negocioId && u.rol === "repartidor"),
      getPlan: (planId) => get().planes.find((p) => p.id === planId),

      crearRepartidor: (negocioId, data) => {
        const exists = get().usuarios.some(
          (u) => u.email.toLowerCase() === data.email.trim().toLowerCase()
        );
        if (exists) return { ok: false, error: "Ya existe una cuenta con ese correo" };
        if (data.password.length < 6) {
          return { ok: false, error: "La contraseña debe tener al menos 6 caracteres" };
        }
        const nuevo: Usuario = {
          id: uuid(),
          negocioId,
          rol: "repartidor",
          nombre: data.nombre,
          email: data.email,
          password: data.password,
          telefono: data.telefono,
          activo: true,
          ultimoLoginAt: null,
          createdAt: nowISO(),
        };
        set((s) => ({ usuarios: [nuevo, ...s.usuarios] }));
        return { ok: true };
      },

      actualizarUsuario: (id, patch) =>
        set((s) => ({ usuarios: s.usuarios.map((u) => (u.id === id ? { ...u, ...patch } : u)) })),

      toggleUsuarioActivo: (id) =>
        set((s) => ({
          usuarios: s.usuarios.map((u) => (u.id === id ? { ...u, activo: !u.activo } : u)),
        })),

      eliminarUsuario: (id) =>
        set((s) => ({ usuarios: s.usuarios.filter((u) => u.id !== id) })),

      crearNegocioManual: (data) => {
        const exists = get().usuarios.some(
          (u) => u.email.toLowerCase() === data.email.trim().toLowerCase()
        );
        if (exists) return { ok: false, error: "Ya existe una cuenta con ese correo" };

        const negocio: Negocio = {
          id: uuid(),
          nombre: data.negocioNombre,
          tipo: data.tipo,
          propietarioNombre: data.propietarioNombre,
          telefonoContacto: data.telefono,
          emailContacto: data.email,
          activo: true,
          precioEnvase20Default: 80,
          precioEnvase10Default: 60,
          createdAt: nowISO(),
        };
        const admin: Usuario = {
          id: uuid(),
          negocioId: negocio.id,
          rol: "admin",
          nombre: data.propietarioNombre,
          email: data.email,
          password: data.password || "cambiar123",
          telefono: data.telefono,
          activo: true,
          ultimoLoginAt: null,
          createdAt: nowISO(),
        };
        set((s) => ({
          negocios: [negocio, ...s.negocios],
          usuarios: [admin, ...s.usuarios],
        }));
        return { ok: true };
      },

      toggleNegocioActivo: (id) =>
        set((s) => ({
          negocios: s.negocios.map((n) => (n.id === id ? { ...n, activo: !n.activo } : n)),
        })),

      emitirLicencia: (input) => {
        const currentUser = get().getCurrentUser();
        const licencia: Licencia = {
          id: uuid(),
          negocioId: input.negocioId,
          planId: input.planId,
          estado: "activa",
          fechaInicio: input.fechaInicio,
          fechaFin: input.fechaFin,
          precioPagado: input.precioPagado,
          notas: input.notas,
          emitidaPor: currentUser?.id ?? null,
          createdAt: nowISO(),
        };
        set((s) => ({ licencias: [licencia, ...s.licencias] }));
      },

      actualizarEstadoLicencia: (licenciaId, estado) =>
        set((s) => ({
          licencias: s.licencias.map((l) => (l.id === licenciaId ? { ...l, estado } : l)),
        })),

      addPlan: (p) =>
        set((s) => ({ planes: [{ ...p, id: uuid(), createdAt: nowISO() }, ...s.planes] })),
      updatePlan: (id, patch) =>
        set((s) => ({ planes: s.planes.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
      togglePlanActivo: (id) =>
        set((s) => ({
          planes: s.planes.map((p) => (p.id === id ? { ...p, activo: !p.activo } : p)),
        })),
    }),
    {
      name: "isdelivery-auth",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => {
        const {
          setHydrated,
          login,
          signup,
          logout,
          getCurrentUser,
          getCurrentNegocio,
          getLicenciaActiva,
          getEstadoEfectivo,
          getRepartidores,
          getPlan,
          crearRepartidor,
          actualizarUsuario,
          toggleUsuarioActivo,
          eliminarUsuario,
          crearNegocioManual,
          toggleNegocioActivo,
          emitirLicencia,
          actualizarEstadoLicencia,
          addPlan,
          updatePlan,
          togglePlanActivo,
          ...rest
        } = s;
        return rest;
      },
    }
  )
);

export type { RolUsuario };
