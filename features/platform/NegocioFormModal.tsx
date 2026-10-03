"use client";

import * as React from "react";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useAuthStore } from "@/store/useAuthStore";
import type { TipoNegocio } from "@/types/auth";

export function NegocioFormModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const crearNegocioManual = useAuthStore((s) => s.crearNegocioManual);

  const [negocioNombre, setNegocioNombre] = React.useState("");
  const [tipo, setTipo] = React.useState<TipoNegocio>("purificadora");
  const [propietarioNombre, setPropietarioNombre] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [telefono, setTelefono] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    setNegocioNombre("");
    setTipo("purificadora");
    setPropietarioNombre("");
    setEmail("");
    setTelefono("");
    setPassword("");
    setError("");
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!negocioNombre.trim() || !propietarioNombre.trim() || !email.trim()) {
      setError("Completa nombre del negocio, propietario y correo");
      return;
    }
    const result = crearNegocioManual({
      negocioNombre: negocioNombre.trim(),
      tipo,
      propietarioNombre: propietarioNombre.trim(),
      email: email.trim(),
      telefono: telefono.trim(),
      password,
    });
    if (!result.ok) {
      setError(result.error ?? "No se pudo crear el negocio");
      return;
    }
    toast.success("Negocio creado. Ahora emítele una licencia.");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="Nuevo negocio" open={open} className="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nombre del negocio</Label>
            <Input value={negocioNombre} onChange={(e) => setNegocioNombre(e.target.value)} />
          </div>
          <div>
            <Label>Tipo</Label>
            <Select value={tipo} onChange={(e) => setTipo(e.target.value as TipoNegocio)}>
              <option value="purificadora">Purificadora</option>
              <option value="independiente">Independiente</option>
            </Select>
          </div>
          <div>
            <Label>Nombre del propietario</Label>
            <Input value={propietarioNombre} onChange={(e) => setPropietarioNombre(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Correo</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label>Teléfono</Label>
              <Input value={telefono} onChange={(e) => setTelefono(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Contraseña temporal</Label>
            <Input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Se le compartirá al cliente"
            />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Crear</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
