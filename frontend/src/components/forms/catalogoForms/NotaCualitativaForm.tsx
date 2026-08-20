"use client";

import { saveNotaCualitativa, updateNotaCualitativa } from "@/actions/catalogos/notaCualitativaMethods";
import { useToast } from "@/hooks/use-toast";
import { NotaCualitativa, NotaCualitativaPayload } from "@/interfaces";
import React, { useEffect, useState } from "react";

interface NotaCualitativaFormProps {
  defaultValues?: NotaCualitativa | null;
  onSuccess: () => void;
}

export default function NotaCualitativaForm({
  defaultValues,
  onSuccess,
}: NotaCualitativaFormProps) {
  const { toast } = useToast();
  const [nombre, setNombre] = useState<string>("");
  const [abreviatura, setAbreviatura] = useState<string>("");
  const [rangoMenor, setRangoMenor] = useState<string>("");
  const [rangoMayor, setRangoMayor] = useState<string>("");

  const isEdit = Boolean(defaultValues?.id);

  useEffect(() => {
    if (!defaultValues) {
      setNombre("");
      setAbreviatura("");
      setRangoMenor("");
      setRangoMayor("");
      return;
    }

    setNombre(defaultValues.nombre || "");
    setAbreviatura(defaultValues.abreviatura || "");
    setRangoMenor(defaultValues.rango_menor?.toString() ?? "");
    setRangoMayor(defaultValues.rango_mayor?.toString() ?? "");
  }, [defaultValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const menor = Number(rangoMenor);
    const mayor = Number(rangoMayor);

    if (rangoMenor === "" || rangoMayor === "") {
      toast({
        title: "Campos requeridos",
        description: "Debes ingresar ambos rangos.",
        variant: "destructive",
      });
      return;
    }

    if (menor >= mayor) {
      toast({
        title: "Rango inválido",
        description: "El rango menor debe ser menor que el rango mayor.",
        variant: "destructive",
      });
      return;
    }

    const payload: NotaCualitativaPayload = {
      nombre,
      abreviatura,
      rango_menor: menor,
      rango_mayor: mayor,
    };

    try {
      if (isEdit && defaultValues?.id) {
        await updateNotaCualitativa(defaultValues.id, payload);
        toast({
          title: "Registro actualizado",
          description: "La nota cualitativa se actualizó correctamente.",
          variant: "success",
        });
      } else {
        await saveNotaCualitativa(payload);
        toast({
          title: "Registro guardado",
          description: "La nota cualitativa se guardó correctamente.",
          variant: "success",
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Error al guardar o actualizar nota cualitativa:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la nota cualitativa.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto px-2">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        {isEdit ? "Editar Nota Cualitativa" : "Agregar Nota Cualitativa"}
      </h2>

      <input
        type="text"
        placeholder="Nombre (ej: Excelente)"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        required
      />

      <input
        type="text"
        placeholder="Abreviatura (ej: EX)"
        value={abreviatura}
        onChange={(e) => setAbreviatura(e.target.value)}
        maxLength={20}
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Rango menor</label>
          <input
            type="number"
            min={0}
            max={100}
            value={rangoMenor}
            onChange={(e) => setRangoMenor(e.target.value)}
            placeholder="0"
            className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Rango mayor</label>
          <input
            type="number"
            min={0}
            max={100}
            value={rangoMayor}
            onChange={(e) => setRangoMayor(e.target.value)}
            placeholder="0"
            className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
            required
          />
        </div>
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
