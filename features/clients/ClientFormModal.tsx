"use client";

import * as React from "react";
import { toast } from "sonner";
import { LocateFixed } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { DaySelector } from "@/components/shared/DaySelector";
import { NexoSelector } from "@/components/shared/NexoSelector";
import { useStore } from "@/store/useStore";
import type { Cliente, DiaSemana, Nexo, TipoCliente, TipoGarrafon, TipoVenta } from "@/types";

const TIPOS_GARRAFON: TipoGarrafon[] = [
  "Nuevo",
  "Ciel",
  "Bonafont",
  "Envase Estándar / Reutilizable",
  "Indiferente",
];

interface ClientFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cliente?: Cliente;
  initialCoords?: [number, number];
  onSaved?: (cliente: Cliente) => void;
}

interface FormState {
  nombre: string;
  telefono: string;
  notas: string;
  tipoCliente: TipoCliente;
  tipoVenta: TipoVenta;
  tipoGarrafon: TipoGarrafon;
  calle: string;
  colonia: string;
  municipio: string;
  estado: string;
  lat: number;
  lng: number;
  diasEntrega: DiaSemana[];
  nexo: Nexo;
  precio20: number;
  precio10: number;
}

function emptyForm(municipioDefault: string, coords?: [number, number]): FormState {
  return {
    nombre: "",
    telefono: "",
    notas: "",
    tipoCliente: "cliente",
    tipoVenta: "menor",
    tipoGarrafon: "Indiferente",
    calle: "",
    colonia: "",
    municipio: municipioDefault,
    estado: "Tlaxcala",
    lat: coords?.[0] ?? 19.3167,
    lng: coords?.[1] ?? -97.9167,
    diasEntrega: [],
    nexo: "verde",
    precio20: 0,
    precio10: 0,
  };
}

export function ClientFormModal({
  open,
  onOpenChange,
  cliente,
  initialCoords,
  onSaved,
}: ClientFormModalProps) {
  const municipios = useStore((s) => s.municipios);
  const addCliente = useStore((s) => s.addCliente);
  const updateCliente = useStore((s) => s.updateCliente);
  const isEditing = !!cliente;

  const [form, setForm] = React.useState<FormState>(() =>
    cliente
      ? {
          nombre: cliente.nombre,
          telefono: cliente.telefono,
          notas: cliente.notas,
          tipoCliente: cliente.tipoCliente,
          tipoVenta: cliente.tipoVenta,
          tipoGarrafon: cliente.tipoGarrafon,
          calle: cliente.calle,
          colonia: cliente.colonia,
          municipio: cliente.municipio,
          estado: cliente.estado,
          lat: cliente.lat,
          lng: cliente.lng,
          diasEntrega: cliente.diasEntrega,
          nexo: cliente.nexo,
          precio20: cliente.precio20,
          precio10: cliente.precio10,
        }
      : emptyForm(municipios[0]?.nombre ?? "", initialCoords)
  );
  const [priceTouched, setPriceTouched] = React.useState(isEditing);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setForm(
        cliente
          ? {
              nombre: cliente.nombre,
              telefono: cliente.telefono,
              notas: cliente.notas,
              tipoCliente: cliente.tipoCliente,
              tipoVenta: cliente.tipoVenta,
              tipoGarrafon: cliente.tipoGarrafon,
              calle: cliente.calle,
              colonia: cliente.colonia,
              municipio: cliente.municipio,
              estado: cliente.estado,
              lat: cliente.lat,
              lng: cliente.lng,
              diasEntrega: cliente.diasEntrega,
              nexo: cliente.nexo,
              precio20: cliente.precio20,
              precio10: cliente.precio10,
            }
          : emptyForm(municipios[0]?.nombre ?? "", initialCoords)
      );
      setPriceTouched(isEditing);
      setError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, cliente]);

  function handleMunicipioChange(nombre: string) {
    const m = municipios.find((mm) => mm.nombre === nombre);
    setForm((f) => ({
      ...f,
      municipio: nombre,
      precio20: !priceTouched && m ? m.precioVenta20 : f.precio20,
      precio10: !priceTouched && m ? m.precioVenta10 : f.precio10,
    }));
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      toast.error("Tu dispositivo no permite obtener ubicación");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setForm((f) => ({ ...f, lat: pos.coords.latitude, lng: pos.coords.longitude })),
      () => toast.error("No se pudo obtener tu ubicación")
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    if (!form.municipio) {
      setError("Selecciona un municipio");
      return;
    }
    if (isEditing && cliente) {
      updateCliente(cliente.id, { ...form });
      toast.success("Cliente actualizado");
      onSaved?.({ ...cliente, ...form });
    } else {
      const nuevo = addCliente({ ...form, fotos: [] });
      toast.success(form.tipoCliente === "prospecto" ? "Prospecto agregado" : "Cliente agregado");
      onSaved?.(nuevo);
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title={isEditing ? "Editar cliente" : "Nuevo cliente"}
        open={open}
        className="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Nombre del cliente o negocio"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Tipo</Label>
              <Select
                value={form.tipoCliente}
                onChange={(e) =>
                  setForm({ ...form, tipoCliente: e.target.value as TipoCliente })
                }
              >
                <option value="cliente">Cliente</option>
                <option value="prospecto">Prospecto</option>
              </Select>
            </div>
            <div>
              <Label>Tipo de venta</Label>
              <Select
                value={form.tipoVenta}
                onChange={(e) => setForm({ ...form, tipoVenta: e.target.value as TipoVenta })}
              >
                <option value="menor">Menudeo</option>
                <option value="mayor">Mayoreo</option>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              placeholder="10 dígitos"
              inputMode="tel"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Municipio</Label>
              <Select
                value={form.municipio}
                onChange={(e) => handleMunicipioChange(e.target.value)}
              >
                <option value="" disabled>
                  Selecciona
                </option>
                {municipios.map((m) => (
                  <option key={m.id} value={m.nombre}>
                    {m.nombre}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="colonia">Colonia</Label>
              <Input
                id="colonia"
                value={form.colonia}
                onChange={(e) => setForm({ ...form, colonia: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="calle">Calle y número</Label>
            <Input
              id="calle"
              value={form.calle}
              onChange={(e) => setForm({ ...form, calle: e.target.value })}
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <Label className="mb-0">Ubicación</Label>
              <button
                type="button"
                onClick={useCurrentLocation}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary-accent"
              >
                <LocateFixed className="h-3.5 w-3.5" />
                Usar ubicación actual
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                step="any"
                value={form.lat}
                onChange={(e) => setForm({ ...form, lat: Number(e.target.value) })}
                aria-label="Latitud"
              />
              <Input
                type="number"
                step="any"
                value={form.lng}
                onChange={(e) => setForm({ ...form, lng: Number(e.target.value) })}
                aria-label="Longitud"
              />
            </div>
          </div>

          <div>
            <Label>Tipo de garrafón preferido</Label>
            <Select
              value={form.tipoGarrafon}
              onChange={(e) => setForm({ ...form, tipoGarrafon: e.target.value as TipoGarrafon })}
            >
              {TIPOS_GARRAFON.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="precio20">Precio venta 20L</Label>
              <Input
                id="precio20"
                type="number"
                step="0.5"
                min="0"
                value={form.precio20}
                onChange={(e) => {
                  setPriceTouched(true);
                  setForm({ ...form, precio20: Number(e.target.value) });
                }}
              />
            </div>
            <div>
              <Label htmlFor="precio10">Precio venta 10L</Label>
              <Input
                id="precio10"
                type="number"
                step="0.5"
                min="0"
                value={form.precio10}
                onChange={(e) => {
                  setPriceTouched(true);
                  setForm({ ...form, precio10: Number(e.target.value) });
                }}
              />
            </div>
          </div>

          <div>
            <Label>Días de entrega</Label>
            <DaySelector
              value={form.diasEntrega}
              onChange={(v) => setForm({ ...form, diasEntrega: v })}
            />
          </div>

          <div>
            <Label>Nexo</Label>
            <NexoSelector value={form.nexo} onChange={(v) => setForm({ ...form, nexo: v })} />
          </div>

          <div>
            <Label htmlFor="notas">Notas</Label>
            <Textarea
              id="notas"
              value={form.notas}
              onChange={(e) => setForm({ ...form, notas: e.target.value })}
              placeholder="Referencias, preferencias, horarios..."
            />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
