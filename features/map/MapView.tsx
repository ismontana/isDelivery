"use client";

import * as React from "react";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import { Plus, LocateFixed, X, Check } from "lucide-react";
import { useStore } from "@/store/useStore";
import type { Cliente } from "@/types";
import { PinMarker, pinMarkerHTML } from "@/components/shared/PinMarker";
import { diasDesdeUltimaActividad } from "@/lib/actividad";
import { GlassButton } from "@/components/shared/GlassButton";
import { ClientDetailSheet } from "@/features/clients/ClientDetailSheet";
import { MapFilters, type MapFilterState } from "./MapFilters";
import { ClientFormModal } from "@/features/clients/ClientFormModal";
import { toast } from "sonner";

const DEFAULT_CENTER: [number, number] = [19.3167, -97.9167]; // Huamantla, Tlaxcala

function pinIcon(cliente: Cliente, dias: number | null) {
  return L.divIcon({
    html: pinMarkerHTML(cliente.tipoCliente, dias),
    className: "",
    iconSize: [34, 42],
    iconAnchor: [17, 42],
  });
}

function placingIcon() {
  return L.divIcon({
    html: ReactDOMServer.renderToStaticMarkup(
      <div style={{ filter: "drop-shadow(0 4px 8px rgba(10,42,67,0.35))" }}>
        <PinMarker tipoCliente="cliente" dias={null} size={38} />
      </div>
    ),
    className: "",
    iconSize: [38, 47],
    iconAnchor: [19, 47],
  });
}

function userLocationIcon() {
  return L.divIcon({
    html: '<span class="user-location-dot"></span>',
    className: "",
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function ClickCatcher({
  active,
  onPick,
}: {
  active: boolean;
  onPick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      if (active) onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

/** Tracks the device's real position with watchPosition and renders a live,
 * pulsing "you are here" marker plus an accuracy circle. Flies the map to the
 * first fix only, so browsing the map afterwards isn't interrupted by updates. */
function UserLocationLayer({ active }: { active: boolean }) {
  const map = useMap();
  const [position, setPosition] = React.useState<[number, number] | null>(null);
  const [accuracy, setAccuracy] = React.useState(0);
  const hasCenteredRef = React.useRef(false);

  React.useEffect(() => {
    if (!active) {
      setPosition(null);
      hasCenteredRef.current = false;
      return;
    }
    if (!navigator.geolocation) {
      toast.error("Tu dispositivo no permite obtener ubicación");
      return;
    }
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy: acc } = pos.coords;
        setPosition([latitude, longitude]);
        setAccuracy(acc);
        if (!hasCenteredRef.current) {
          hasCenteredRef.current = true;
          map.flyTo([latitude, longitude], 16, { duration: 0.8 });
        }
      },
      () => {
        toast.error("No se pudo obtener tu ubicación en tiempo real");
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  if (!active || !position) return null;

  return (
    <>
      {accuracy > 0 && (
        <Circle
          center={position}
          radius={accuracy}
          pathOptions={{ color: "#1E6FA8", fillColor: "#4FA3D1", fillOpacity: 0.12, weight: 1 }}
        />
      )}
      <Marker position={position} icon={userLocationIcon()} zIndexOffset={1000} />
    </>
  );
}

export function MapView() {
  const clientes = useStore((s) => s.clientes);
  const ventas = useStore((s) => s.ventas);
  const pedidos = useStore((s) => s.pedidos);
  const [filters, setFilters] = React.useState<MapFilterState>({
    municipio: "todos",
    tipo: "todos",
    tipoVenta: "todos",
  });
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [placing, setPlacing] = React.useState(false);
  const [pendingCoords, setPendingCoords] = React.useState<[number, number] | null>(null);
  const [formOpen, setFormOpen] = React.useState(false);
  const [tracking, setTracking] = React.useState(false);

  const filtered = React.useMemo(() => {
    return clientes.filter((c) => {
      if (filters.municipio !== "todos" && c.municipio !== filters.municipio) return false;
      if (filters.tipo !== "todos" && c.tipoCliente !== filters.tipo) return false;
      if (filters.tipoVenta !== "todos" && c.tipoVenta !== filters.tipoVenta) return false;
      return true;
    });
  }, [clientes, filters]);

  const selected = clientes.find((c) => c.id === selectedId) ?? null;

  function startPlacing() {
    setPlacing(true);
    toast("Toca el mapa para ubicar al cliente", { icon: <Plus className="h-4 w-4" /> });
  }

  function handlePick(lat: number, lng: number) {
    setPendingCoords([lat, lng]);
  }

  function confirmPlacement() {
    setPlacing(false);
    setFormOpen(true);
  }

  function cancelPlacing() {
    setPlacing(false);
    setPendingCoords(null);
  }

  function toggleTracking() {
    setTracking((t) => {
      const next = !t;
      toast.success(next ? "Ubicación en tiempo real activada" : "Ubicación en tiempo real desactivada");
      return next;
    });
  }

  return (
    // `isolate` gives this wrapper its own stacking context so Leaflet's internal
    // panes (which use high z-index values) can never render above content
    // outside the map, such as the client bottom sheet or any modal.
    <div className="relative isolate h-full w-full overflow-hidden rounded-card border border-border">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={13}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickCatcher active={placing} onPick={handlePick} />
        <UserLocationLayer active={tracking} />
        {filtered.map((c) => (
          <Marker
            key={c.id}
            position={[c.lat, c.lng]}
            icon={pinIcon(c, diasDesdeUltimaActividad(c.id, ventas, pedidos))}
            eventHandlers={{ click: () => setSelectedId(c.id) }}
          />
        ))}
        {pendingCoords && (
          <Marker
            position={pendingCoords}
            icon={placingIcon()}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const m = e.target as L.Marker;
                const pos = m.getLatLng();
                setPendingCoords([pos.lat, pos.lng]);
              },
            }}
          />
        )}
      </MapContainer>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[700] flex justify-center p-3">
        <div className="pointer-events-auto w-full max-w-md">
          <MapFilters value={filters} onChange={setFilters} />
        </div>
      </div>

      {placing && (
        <div className="pointer-events-none absolute inset-x-0 bottom-4 z-[700] flex justify-center px-4">
          <div className="glass glass-shadow pointer-events-auto flex items-center gap-2 rounded-capsule px-4 py-2.5 text-sm text-ink">
            {pendingCoords ? (
              <>
                <span>Arrastra el pin para ajustar</span>
                <GlassButton size="icon-sm" variant="primary" onClick={confirmPlacement} aria-label="Confirmar ubicación">
                  <Check className="h-4 w-4" />
                </GlassButton>
                <GlassButton size="icon-sm" onClick={cancelPlacing} aria-label="Cancelar">
                  <X className="h-4 w-4" />
                </GlassButton>
              </>
            ) : (
              <>
                <span>Toca el mapa para ubicar</span>
                <GlassButton size="icon-sm" onClick={cancelPlacing} aria-label="Cancelar">
                  <X className="h-4 w-4" />
                </GlassButton>
              </>
            )}
          </div>
        </div>
      )}

      {!placing && (
        <div className="absolute bottom-4 right-4 z-[700] flex flex-col gap-2">
          <GlassButton
            size="icon"
            variant={tracking ? "primary" : "icon"}
            aria-label={tracking ? "Desactivar ubicación en tiempo real" : "Activar ubicación en tiempo real"}
            onClick={toggleTracking}
          >
            <LocateFixed className="h-5 w-5" />
          </GlassButton>
          <GlassButton
            size="icon"
            variant="primary"
            aria-label="Agregar cliente"
            onClick={startPlacing}
          >
            <Plus className="h-5 w-5" />
          </GlassButton>
        </div>
      )}

      <ClientDetailSheet
        cliente={selected}
        open={!!selected}
        onOpenChange={(open) => !open && setSelectedId(null)}
      />

      <ClientFormModal
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setPendingCoords(null);
        }}
        initialCoords={pendingCoords ?? undefined}
        onSaved={() => {
          setPendingCoords(null);
          toast.success("Cliente agregado al mapa");
        }}
      />
    </div>
  );
}

