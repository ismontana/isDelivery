import { v4 as uuid } from "uuid";
import type { Licencia, Negocio, Plan, Usuario } from "@/types/auth";

function daysFromNowISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
function daysAgoISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export const DEMO_CREDENTIALS = {
  superAdmin: { email: "yo@isdelivery.mx", password: "super1234" },
  admin: { email: "dueno@elmanantial.mx", password: "admin1234" },
  repartidor: { email: "juan@elmanantial.mx", password: "reparto1234" },
};

export function seedPlanes(): Plan[] {
  return [
    {
      id: uuid(),
      nombre: "Prueba gratuita",
      descripcion: "14 días para probar la app completa",
      maxRepartidores: 1,
      precioMensual: 0,
      activo: true,
      createdAt: daysAgoISO(60),
    },
    {
      id: uuid(),
      nombre: "Independiente",
      descripcion: "Para un vendedor de agua por su cuenta",
      maxRepartidores: 1,
      precioMensual: 199,
      activo: true,
      createdAt: daysAgoISO(60),
    },
    {
      id: uuid(),
      nombre: "Purificadora Básica",
      descripcion: "Hasta 3 repartidores",
      maxRepartidores: 3,
      precioMensual: 499,
      activo: true,
      createdAt: daysAgoISO(60),
    },
    {
      id: uuid(),
      nombre: "Purificadora Pro",
      descripcion: "Hasta 10 repartidores",
      maxRepartidores: 10,
      precioMensual: 999,
      activo: true,
      createdAt: daysAgoISO(60),
    },
  ];
}

export function seedNegocios(): Negocio[] {
  return [
    {
      id: uuid(),
      nombre: "Purificadora El Manantial",
      tipo: "purificadora",
      propietarioNombre: "Roberto Hernández",
      telefonoContacto: "2471011234",
      emailContacto: DEMO_CREDENTIALS.admin.email,
      activo: true,
      precioEnvase20Default: 80,
      precioEnvase10Default: 60,
      createdAt: daysAgoISO(45),
    },
  ];
}

export function seedLicencias(negocios: Negocio[], planes: Plan[]): Licencia[] {
  const negocio = negocios[0];
  const planPro = planes.find((p) => p.nombre === "Purificadora Pro")!;
  return [
    {
      id: uuid(),
      negocioId: negocio.id,
      planId: planPro.id,
      estado: "activa",
      fechaInicio: daysFromNowISO(-45),
      fechaFin: daysFromNowISO(20),
      precioPagado: 999,
      notas: "Renovación mensual",
      emitidaPor: null,
      createdAt: daysAgoISO(45),
    },
  ];
}

export function seedUsuarios(negocios: Negocio[]): Usuario[] {
  const negocio = negocios[0];
  return [
    {
      id: uuid(),
      negocioId: null,
      rol: "super_admin",
      nombre: "Administrador de la plataforma",
      email: DEMO_CREDENTIALS.superAdmin.email,
      password: DEMO_CREDENTIALS.superAdmin.password,
      telefono: "",
      activo: true,
      ultimoLoginAt: null,
      createdAt: daysAgoISO(90),
    },
    {
      id: uuid(),
      negocioId: negocio.id,
      rol: "admin",
      nombre: "Roberto Hernández",
      email: DEMO_CREDENTIALS.admin.email,
      password: DEMO_CREDENTIALS.admin.password,
      telefono: "2471011234",
      activo: true,
      ultimoLoginAt: null,
      createdAt: daysAgoISO(45),
    },
    {
      id: uuid(),
      negocioId: negocio.id,
      rol: "repartidor",
      nombre: "Juan Pérez",
      email: DEMO_CREDENTIALS.repartidor.email,
      password: DEMO_CREDENTIALS.repartidor.password,
      telefono: "2471019999",
      activo: true,
      ultimoLoginAt: null,
      createdAt: daysAgoISO(40),
    },
  ];
}
