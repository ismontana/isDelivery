# isDelivery

Progressive Web App para repartidores de agua en garrafón: mapa de ruta, pedidos, clientes, ventas/préstamos/deudas e inventario. Construida con Next.js (App Router) + TypeScript + Tailwind CSS + Zustand + Framer Motion + react-leaflet + recharts.

Todos los datos se guardan **localmente en el dispositivo** (localStorage), no hay backend ni servidor de datos: la app funciona completamente offline una vez instalada.

## Requisitos

- Node.js 18.18 o superior (recomendado 20+)
- npm 9+

## Instalación y ejecución en desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) — la app redirige automáticamente a `/map`.

## Compilar para producción

```bash
npm run build
npm start
```

## Instalar como PWA

1. Corre la app en producción (`npm run build && npm start`) o despliégala en cualquier hosting que sirva HTTPS (Vercel, Netlify, etc.). El manifest y el service worker (`/manifest.json`, `/sw.js`) ya están configurados con `display: standalone`, ícono, tema de color y caché offline-first.
2. En Chrome/Edge (Android o desktop): menú → "Instalar app" / ícono de instalación en la barra de direcciones.
3. En iOS Safari: botón de compartir → "Agregar a pantalla de inicio".

> Nota: el service worker solo se registra quando `NODE_ENV === "production"` (es decir, con `npm run build && npm start`, no con `npm run dev`).

## Estructura del proyecto

```
app/                 Rutas (App Router): /map /orders /clients /sales /settings
features/             Lógica y UI específica de cada módulo
  map/                Mapa interactivo (react-leaflet), filtros, bottom sheet de cliente
  orders/             Lista de pedidos, tarjetas, agrupación por día/municipio
  clients/            Tabla editable, modales de venta/préstamo/pedido/historial
  sales/              Sub-tabs: Ventas · Llenados · Deudas · Finanzas
  settings/            Purificadoras, municipios, envase default, inventario, export/import
components/
  ui/                 Primitivas de UI (botón, input, dialog, tabs, switch, etc.)
  shared/              Componentes reutilizables (GlassButton, BottomSheet, DataTable,
                       PinMarker, Stat, EmptyState, ConfirmDialog, BottomTabBar, ...)
store/                Estado global (Zustand + persistencia en localStorage) y datos demo
types/                Tipos TypeScript del dominio
public/                manifest.json, service worker (sw.js) e íconos PWA
```

## Datos de demostración

Al abrir la app por primera vez se cargan automáticamente: 3 municipios, 2 purificadoras, 8 clientes/prospectos, pedidos, ventas, un préstamo, llenados, gastos y stock inicial. Desde **Ajustes → Exportar/Importar** puedes:

- Exportar todos los datos a un archivo `.json` (respaldo).
- Importar un archivo `.json` previamente exportado.
- Restablecer los datos de demostración.

## Notas de diseño

- Efecto "liquid glass" (`backdrop-blur` + transparencias) aplicado a la barra de navegación, modales, bottom sheets, tooltips y toasts.
- Tema claro/oscuro conmutable desde Ajustes (también respeta el color de la barra de estado del sistema).
- Mobile-first: pensado para pantallas de celular, con diseño centrado responsivo hasta tablet/escritorio.
- Sin emojis ni degradados; iconografía exclusivamente de `lucide-react`.
