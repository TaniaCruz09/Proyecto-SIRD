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
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [cantidadPeriodos, setCantidadPeriodos] = useState("1");
  const [etiquetaPeriodo, setEtiquetaPeriodo] = useState("");
  const [prefijoAbreviatura, setPrefijoAbreviatura] = useState("");
  const [isActive, setIsActive] = useState(true);

  const isEdit = Boolean(defaultValues?.id);

  useEffect(() => {
    if (!defaultValues) return;

    setCodigo(defaultValues.codigo || "");
    setNombre(defaultValues.nombre || "");
    setCantidadPeriodos(String(defaultValues.cantidad_periodos || 1));
    setEtiquetaPeriodo(defaultValues.etiqueta_periodo || "");
    setPrefijoAbreviatura(defaultValues.prefijo_abreviatura || "");
    setIsActive(defaultValues.isActive ?? true);
  }, [defaultValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        codigo: codigo.trim().toUpperCase(),
        nombre: nombre.trim(),
        cantidad_periodos: Number.parseInt(cantidadPeriodos, 10) || 1,
        etiqueta_periodo: etiquetaPeriodo.trim() || undefined,
        prefijo_abreviatura: prefijoAbreviatura.trim() || undefined,
        isActive,
      };

      if (isEdit && defaultValues?.id) {
        await updateTipoPeriodizacion(defaultValues.id, payload);
        toast({
          title: "Registro actualizado",
          description: "El tipo de periodizacion se actualizo correctamente.",
          variant: "success",
        });
      } else {
        await saveTipoPeriodizacion(payload);
        toast({
          title: "Registro creado",
          description: "El tipo de periodizacion se creo correctamente.",
          variant: "success",
        });
      }

      onSuccess();
    } catch (error) {
      console.error("Error al guardar tipo de periodizacion:", error);
      toast({
        title: "Error al guardar",
        description: "No se pudo guardar el tipo de periodizacion.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto px-2">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        {isEdit ? "Editar Tipo de Periodizacion" : "Agregar Tipo de Periodizacion"}
      </h2>

      <input
        type="text"
        placeholder="Codigo (ej: SEMESTRE)"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        required
      />

      <input
        type="text"
        placeholder="Nombre (ej: Semestral)"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        required
      />

      <input
        type="number"
        min="1"
        placeholder="Cantidad de periodos"
        value={cantidadPeriodos}
        onChange={(e) => setCantidadPeriodos(e.target.value)}
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        required
      />

      <input
        type="text"
        placeholder="Etiqueta del periodo (ej: Semestre)"
        value={etiquetaPeriodo}
        onChange={(e) => setEtiquetaPeriodo(e.target.value)}
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
      />

      <input
        type="text"
        placeholder="Prefijo abreviatura (ej: S)"
        value={prefijoAbreviatura}
        onChange={(e) => setPrefijoAbreviatura(e.target.value)}
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
      />

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        Activo
      </label>

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
