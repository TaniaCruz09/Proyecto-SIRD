"use client";

import {
  saveTipoPeriodizacion,
  updateTipoPeriodizacion,
} from "@/actions/catalogos/tipoPeriodizacionMethods";
import { useToast } from "@/hooks/use-toast";
import { TipoPeriodizacion } from "@/interfaces";
import React, { useEffect, useState } from "react";

interface TipoPeriodizacionFormProps {
  defaultValues?: TipoPeriodizacion | null;
  onSuccess: () => void;
}

export default function TipoPeriodizacionForm({ defaultValues, onSuccess }: TipoPeriodizacionFormProps) {
  const { toast } = useToast();
  const [nombre, setNombre] = useState("");
  const [cantidadPeriodos, setCantidadPeriodos] = useState("1");
  const [prefijoAbreviatura, setPrefijoAbreviatura] = useState("");
  const [isActive, setIsActive] = useState(true);

  const isEdit = Boolean(defaultValues?.id);

  useEffect(() => {
    if (!defaultValues) return;

    setNombre(defaultValues.nombre || "");
    setCantidadPeriodos(String(defaultValues.cantidad_periodos || 1));
    setPrefijoAbreviatura(defaultValues.prefijo_abreviatura || "");
    setIsActive(defaultValues.isActive ?? true);
  }, [defaultValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        nombre: nombre.trim(),
        cantidad_periodos: Number.parseInt(cantidadPeriodos, 10) || 1,
        prefijo_abreviatura: prefijoAbreviatura.trim() || undefined,
        isActive,
      };

      if (isEdit && defaultValues?.id) {
        await updateTipoPeriodizacion(defaultValues.id, payload);
        toast({
          title: "Registro actualizado",
          description: "El tipo de periodo se actualizo correctamente.",
          variant: "success",
        });
      } else {
        await saveTipoPeriodizacion(payload);
        toast({
          title: "Registro creado",
          description: "El tipo de periodo se creo correctamente.",
          variant: "success",
        });
      }

      onSuccess();
    } catch (error) {
      console.error("Error al guardar tipo de periodo:", error);
      toast({
        title: "Error al guardar",
        description: "No se pudo guardar el tipo de periodo.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto px-2">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        {isEdit ? "Editar Tipo de Periodo" : "Agregar Tipo de Periodo"}
      </h2>

      <div className="space-y-2">
        <label htmlFor="tipo-periodizacion-nombre" className="block text-sm font-medium text-gray-700">
          Nombre
        </label>
        <input
          id="tipo-periodizacion-nombre"
          type="text"
          placeholder="Ej: Semestral"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="tipo-periodizacion-cantidad" className="block text-sm font-medium text-gray-700">
          Cantidad de periodos
        </label>
        <input
          id="tipo-periodizacion-cantidad"
          type="number"
          min="1"
          placeholder="Ej: 2"
          value={cantidadPeriodos}
          onChange={(e) => setCantidadPeriodos(e.target.value)}
          className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="tipo-periodizacion-prefijo" className="block text-sm font-medium text-gray-700">
          Prefijo
        </label>
        <input
          id="tipo-periodizacion-prefijo"
          type="text"
          placeholder="Ej: S"
          value={prefijoAbreviatura}
          onChange={(e) => setPrefijoAbreviatura(e.target.value)}
          className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        />
      </div>

      <div className="space-y-2">
        <span className="block text-sm font-medium text-gray-700">Estado</span>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Activo
        </label>
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          className="px-20 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 mb-6"
        >
          {isEdit ? "Actualizar" : "Guardar"}
        </button>
      </div>
    </form>
  );
}
