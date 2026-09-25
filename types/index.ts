export type Nexo = "rojo" | "amarillo" | "verde";

export type TipoGarrafon =
  | "Nuevo"
  | "Ciel"
  | "Bonafont"
  | "Envase Estándar / Reutilizable"
  | "Indiferente";

export type TipoCliente = "cliente" | "prospecto";
export type TipoVenta = "mayor" | "menor";
export type DiaSemana = "L" | "M" | "X" | "J" | "V" | "S";
export const DIAS_SEMANA: DiaSemana[] = ["L", "M", "X", "J", "V", "S"];
export const DIA_LABEL: Record<DiaSemana, string> = {
  L: "Lun",
  M: "Mar",
  X: "Mié",
  J: "Jue",
  V: "Vie",
  S: "Sáb",
};

export interface Cliente {
  id: string;
  nombre: string;
  notas: string;
  telefono: string;
  fotos: string[];
  deuda: number; // saldo en contra únicamente, nunca a favor (>= 0)
  tipoGarrafon: TipoGarrafon;
  calle: string;
  colonia: string;
  municipio: string;
  estado: string;
  lat: number;
  lng: number;
  tipoCliente: TipoCliente;
  tipoVenta: TipoVenta;
  diasEntrega: DiaSemana[];
  nexo: Nexo;
  precio20: number;
  precio10: number;
  createdAt: string;
}

export type PedidoEstado = "pendiente" | "completado";

export interface Pedido {
  id: string;
  clienteId: string;
  fecha: string;
  cantidad20: number;
  cantidad10: number;
  notas: string;
  estado: PedidoEstado;
  createdAt: string;
}

export type EstadoPago = "pagado" | "fiado";

export interface Venta {
  id: string;
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
  estadoPago: EstadoPago;
  total: number;
  montoPendiente: number; // 0 si está pagado o ya liquidado
  pedidoOrigenId?: string;
}

export interface Prestamo {
  id: string;
  clienteId: string;
  fecha: string;
  envase20: number; // envases prestados (no se cobran)
  envase10: number;
  liquido20: number; // garrafones llenos prestados
  liquido10: number;
  aguaPagada: boolean; // si el líquido prestado ya fue pagado al momento
  precioLiquido20: number;
  precioLiquido10: number;
  montoLiquidoPendiente: number; // 0 si aguaPagada o ya liquidado
  envase20Pendiente: number; // por recoger
  envase10Pendiente: number;
}

export interface Purificadora {
  id: string;
  nombre: string;
  direccion: string;
  precioLlenado20: number;
  precioLlenado10: number;
}

export interface Llenado {
  id: string;
  purificadoraId: string;
  fecha: string;
  cantidad20: number;
  precio20: number;
  cantidad10: number;
  precio10: number;
  total: number;
}

export interface Municipio {
  id: string;
  nombre: string;
  precioVenta20: number;
  precioVenta10: number;
  diasRuta: DiaSemana[];
}

export interface EnvaseDefault {
  precio20: number;
  precio10: number;
}

export type StockMovimientoTipo =
  | "compra"
  | "roto"
  | "venta"
  | "prestamo_salida"
  | "prestamo_regreso"
  | "ajuste";

export interface StockMovimiento {
  id: string;
  fecha: string;
  tipo: StockMovimientoTipo;
  tamano: "20L" | "10L";
  cantidad: number; // positivo = entra a stock propio, negativo = sale
  nota: string;
}

export interface Gasto {
  id: string;
  fecha: string;
  monto: number;
  nota: string;
}

export interface Stock {
  propio20: number;
  propio10: number;
  enPoderClientes20: number;
  enPoderClientes10: number;
}

export type DeudaTipo = "venta_fiada" | "envase" | "liquido";

export interface DeudaRow {
  id: string;
  origenId: string;
  origenTipo: "venta" | "prestamo";
  clienteId: string;
  clienteNombre: string;
  tipo: DeudaTipo;
  tamano: "20L" | "10L" | "mixto";
  cantidad: number;
  fecha: string;
  montoAdeudado: number;
}

export type ThemeMode = "light" | "dark";
