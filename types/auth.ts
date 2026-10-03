export type RolUsuario = "super_admin" | "admin" | "repartidor";
export type TipoNegocio = "purificadora" | "independiente";
export type EstadoLicencia = "activa" | "vencida" | "suspendida" | "cancelada";

export interface Plan {
  id: string;
  nombre: string;
  descripcion: string;
  maxRepartidores: number;
  precioMensual: number;
  activo: boolean;
  createdAt: string;
}

export interface Negocio {
  id: string;
  nombre: string;
  tipo: TipoNegocio;
  propietarioNombre: string;
  telefonoContacto: string;
  emailContacto: string;
  activo: boolean;
  precioEnvase20Default: number;
  precioEnvase10Default: number;
  createdAt: string;
}

export interface Licencia {
  id: string;
  negocioId: string;
  planId: string;
  estado: EstadoLicencia;
  fechaInicio: string; // ISO date
  fechaFin: string; // ISO date
  precioPagado: number;
  notas: string;
  emitidaPor: string | null;
  createdAt: string;
}

export interface Usuario {
  id: string;
  negocioId: string | null; // null solo si rol === 'super_admin'
  rol: RolUsuario;
  nombre: string;
  email: string;
  /** DEMO ONLY: contraseña en texto plano para simular login sin backend.
   *  Cuando exista el backend en Node.js, esto se reemplaza por completo
   *  con password_hash (bcrypt) validado en el servidor — nunca debe
   *  viajar ni guardarse así en producción. */
  password: string;
  telefono: string;
  activo: boolean;
  ultimoLoginAt: string | null;
  createdAt: string;
}
