import { v4 as uuid } from "uuid";
import type {
  Cliente,
  EnvaseDefault,
  Gasto,
  Llenado,
  Municipio,
  Pedido,
  Prestamo,
  Purificadora,
  Stock,
  StockMovimiento,
  Venta,
} from "@/types";

function daysAgoISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export function seedMunicipios(): Municipio[] {
  return [
    {
      id: uuid(),
      nombre: "Huamantla",
      precioVenta20: 20,
      precioVenta10: 12,
      diasRuta: ["L", "X", "V"],
    },
    {
      id: uuid(),
      nombre: "Ixtenco",
      precioVenta20: 22,
      precioVenta10: 13,
      diasRuta: ["M", "J"],
    },
    {
      id: uuid(),
      nombre: "Zacatelco",
      precioVenta20: 21,
      precioVenta10: 12,
      diasRuta: ["L", "M", "X", "J", "V"],
    },
  ];
}

export function seedEnvaseDefault(): EnvaseDefault {
  return { precio20: 80, precio10: 60 };
}

export function seedPurificadoras(): Purificadora[] {
  return [
    {
      id: uuid(),
      nombre: "Purificadora El Manantial",
      direccion: "Av. Juárez 45, Huamantla",
      precioLlenado20: 5,
      precioLlenado10: 3,
    },
    {
      id: uuid(),
      nombre: "Agua Pura Tlaxcala",
      direccion: "Carretera Federal km 3, Ixtenco",
      precioLlenado20: 5.5,
      precioLlenado10: 3.2,
    },
  ];
}

export function seedClientes(municipios: Municipio[]): Cliente[] {
  const [hua, ixt, zac] = municipios;
  const base: Array<Partial<Cliente> & { nombre: string; municipio: string }> = [
    {
      nombre: "Abarrotes Don Beto",
      municipio: hua.nombre,
      tipoCliente: "cliente",
      tipoVenta: "mayor",
      nexo: "verde",
      lat: 19.3167,
      lng: -97.9167,
      precio20: hua.precioVenta20,
      precio10: hua.precioVenta10,
      diasEntrega: ["L", "V"],
      tipoGarrafon: "Nuevo",
      telefono: "2471011234",
      colonia: "Centro",
    },
    {
      nombre: "Familia Ramírez",
      municipio: hua.nombre,
      tipoCliente: "cliente",
      tipoVenta: "menor",
      nexo: "amarillo",
      lat: 19.312,
      lng: -97.921,
      precio20: hua.precioVenta20,
      precio10: hua.precioVenta10,
      diasEntrega: ["L", "X"],
      tipoGarrafon: "Ciel",
      telefono: "2471012345",
      colonia: "San Lucas",
    },
    {
      nombre: "Fonda Lupita",
      municipio: hua.nombre,
      tipoCliente: "cliente",
      tipoVenta: "mayor",
      nexo: "rojo",
      lat: 19.32,
      lng: -97.913,
      precio20: hua.precioVenta20,
      precio10: hua.precioVenta10,
      diasEntrega: ["V"],
      tipoGarrafon: "Indiferente",
      telefono: "2471013456",
      colonia: "La Trinidad",
    },
    {
      nombre: "Taller Mecánico Ixtenco",
      municipio: ixt.nombre,
      tipoCliente: "cliente",
      tipoVenta: "menor",
      nexo: "verde",
      lat: 19.335,
      lng: -97.868,
      precio20: ixt.precioVenta20,
      precio10: ixt.precioVenta10,
      diasEntrega: ["M", "J"],
      tipoGarrafon: "Bonafont",
      telefono: "2471014567",
      colonia: "Centro",
    },
    {
      nombre: "Sra. Con­cepción Flores",
      municipio: ixt.nombre,
      tipoCliente: "prospecto",
      tipoVenta: "menor",
      nexo: "amarillo",
      lat: 19.331,
      lng: -97.871,
      precio20: ixt.precioVenta20,
      precio10: ixt.precioVenta10,
      diasEntrega: [],
      tipoGarrafon: "Envase Estándar / Reutilizable",
      telefono: "2471015678",
      colonia: "San Miguel",
    },
    {
      nombre: "Papelería Escolar",
      municipio: zac.nombre,
      tipoCliente: "cliente",
      tipoVenta: "menor",
      nexo: "verde",
      lat: 19.281,
      lng: -98.181,
      precio20: zac.precioVenta20,
      precio10: zac.precioVenta10,
      diasEntrega: ["L", "M", "X", "J", "V"],
      tipoGarrafon: "Nuevo",
      telefono: "2471016789",
      colonia: "Centro",
    },
    {
      nombre: "Restaurante El Nopal",
      municipio: zac.nombre,
      tipoCliente: "prospecto",
      tipoVenta: "mayor",
      nexo: "verde",
      lat: 19.285,
      lng: -98.176,
      precio20: zac.precioVenta20,
      precio10: zac.precioVenta10,
      diasEntrega: [],
      tipoGarrafon: "Indiferente",
      telefono: "2471017890",
      colonia: "Guadalupe",
    },
    {
      nombre: "Sr. Herrera",
      municipio: hua.nombre,
      tipoCliente: "cliente",
      tipoVenta: "menor",
      nexo: "amarillo",
      lat: 19.309,
      lng: -97.928,
      precio20: hua.precioVenta20,
      precio10: hua.precioVenta10,
      diasEntrega: ["X"],
      tipoGarrafon: "Ciel",
      telefono: "2471018901",
      colonia: "El Carmen",
    },
  ];

  return base.map((c) => ({
    id: uuid(),
    nombre: c.nombre,
    notas: "",
    telefono: c.telefono ?? "",
    fotos: [],
    deuda: 0,
    tipoGarrafon: c.tipoGarrafon ?? "Indiferente",
    calle: "",
    colonia: c.colonia ?? "",
    municipio: c.municipio,
    estado: "Tlaxcala",
    lat: c.lat ?? 19.31,
    lng: c.lng ?? -97.92,
    tipoCliente: c.tipoCliente ?? "cliente",
    tipoVenta: c.tipoVenta ?? "menor",
    diasEntrega: c.diasEntrega ?? [],
    nexo: c.nexo ?? "verde",
    precio20: c.precio20 ?? 20,
    precio10: c.precio10 ?? 12,
    createdAt: daysAgoISO(30),
  }));
}

export function seedPedidos(clientes: Cliente[]): Pedido[] {
  const [c0, c1, , c3] = clientes;
  return [
    {
      id: uuid(),
      clienteId: c0.id,
      fecha: daysAgoISO(0),
      cantidad20: 3,
      cantidad10: 0,
      notas: "Dejar en la entrada de la tienda",
      estado: "pendiente",
      createdAt: daysAgoISO(0),
    },
    {
      id: uuid(),
      clienteId: c1.id,
      fecha: daysAgoISO(0),
      cantidad20: 1,
      cantidad10: 1,
      notas: "",
      estado: "pendiente",
      createdAt: daysAgoISO(0),
    },
    {
      id: uuid(),
      clienteId: c3.id,
      fecha: daysAgoISO(1),
      cantidad20: 2,
      cantidad10: 0,
      notas: "Llamar antes de llegar",
      estado: "pendiente",
      createdAt: daysAgoISO(1),
    },
  ];
}

export function seedVentas(clientes: Cliente[]): Venta[] {
  const [c0, c1, c2] = clientes;
  return [
    {
      id: uuid(),
      clienteId: c0.id,
      fecha: daysAgoISO(2),
      cantidad20: 5,
      cantidad10: 0,
      precio20: c0.precio20,
      precio10: c0.precio10,
      incluyeEnvase: false,
      envase20Cantidad: 0,
      envase10Cantidad: 0,
      precioEnvase20: 80,
      precioEnvase10: 60,
      estadoPago: "pagado",
      total: 5 * c0.precio20,
      montoPendiente: 0,
    },
    {
      id: uuid(),
      clienteId: c1.id,
      fecha: daysAgoISO(3),
      cantidad20: 2,
      cantidad10: 1,
      precio20: c1.precio20,
      precio10: c1.precio10,
      incluyeEnvase: false,
      envase20Cantidad: 0,
      envase10Cantidad: 0,
      precioEnvase20: 80,
      precioEnvase10: 60,
      estadoPago: "fiado",
      total: 2 * c1.precio20 + 1 * c1.precio10,
      montoPendiente: 2 * c1.precio20 + 1 * c1.precio10,
    },
    {
      id: uuid(),
      clienteId: c2.id,
      fecha: daysAgoISO(5),
      cantidad20: 4,
      cantidad10: 0,
      precio20: c2.precio20,
      precio10: c2.precio10,
      incluyeEnvase: true,
      envase20Cantidad: 1,
      envase10Cantidad: 0,
      precioEnvase20: 80,
      precioEnvase10: 60,
      estadoPago: "fiado",
      total: 4 * c2.precio20 + 1 * 80,
      montoPendiente: 4 * c2.precio20 + 1 * 80,
    },
  ];
}

export function seedPrestamos(clientes: Cliente[]): Prestamo[] {
  const [, , , , , , c6] = clientes;
  const c = c6 ?? clientes[0];
  return [
    {
      id: uuid(),
      clienteId: c.id,
      fecha: daysAgoISO(6),
      envase20: 2,
      envase10: 0,
      liquido20: 2,
      liquido10: 0,
      aguaPagada: false,
      precioLiquido20: c.precio20,
      precioLiquido10: c.precio10,
      montoLiquidoPendiente: 2 * c.precio20,
      envase20Pendiente: 2,
      envase10Pendiente: 0,
    },
  ];
}

export function seedLlenados(purificadoras: Purificadora[]): Llenado[] {
  const [p0, p1] = purificadoras;
  return [
    {
      id: uuid(),
      purificadoraId: p0.id,
      fecha: daysAgoISO(1),
      cantidad20: 60,
      precio20: p0.precioLlenado20,
      cantidad10: 20,
      precio10: p0.precioLlenado10,
      total: 60 * p0.precioLlenado20 + 20 * p0.precioLlenado10,
    },
    {
      id: uuid(),
      purificadoraId: p1.id,
      fecha: daysAgoISO(1),
      cantidad20: 40,
      precio20: p1.precioLlenado20,
      cantidad10: 0,
      precio10: p1.precioLlenado10,
      total: 40 * p1.precioLlenado20,
    },
  ];
}

export function seedGastos(): Gasto[] {
  return [
    { id: uuid(), fecha: daysAgoISO(1), monto: 450, nota: "Gasolina ruta Huamantla" },
    { id: uuid(), fecha: daysAgoISO(4), monto: 380, nota: "Gasolina ruta Zacatelco" },
  ];
}

export function seedStock(): Stock {
  return {
    propio20: 120,
    propio10: 45,
    enPoderClientes20: 30,
    enPoderClientes10: 8,
  };
}

export function seedStockMovimientos(): StockMovimiento[] {
  return [
    {
      id: uuid(),
      fecha: daysAgoISO(10),
      tipo: "compra",
      tamano: "20L",
      cantidad: 150,
      nota: "Compra inicial de garrafones nuevos",
    },
    {
      id: uuid(),
      fecha: daysAgoISO(10),
      tipo: "compra",
      tamano: "10L",
      cantidad: 50,
      nota: "Compra inicial de garrafones nuevos",
    },
    {
      id: uuid(),
      fecha: daysAgoISO(2),
      tipo: "roto",
      tamano: "20L",
      cantidad: -2,
      nota: "Garrafones dañados en ruta",
    },
  ];
}
