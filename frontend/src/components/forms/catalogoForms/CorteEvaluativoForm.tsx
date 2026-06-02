"use client";

import {
  saveCorteEvaluativo,
  updateCorteEvaluativo,
} from "@/actions/catalogos/corteEvaluativoMethods";
import { Corte } from "@/interfaces";
import React, { useEffect, useState } from "react";
import { useToast } from '@/hooks/use-toast'

interface CorteEvaluativoFormProps {
  defaultValues?: Corte | null;
  onSuccess: () => void;
}

export default function CorteEvaluativoForm({
  defaultValues,
  onSuccess,
}: CorteEvaluativoFormProps) {
  const { toast } = useToast()
  const [corteEvaluativo, setCorteEvaluativo] = useState<string>("");
  const [abreviatura, setAbriatura] = useState<string>("");

  const isEdit = Boolean(defaultValues?.id);

  //rellenar los campos si va a editar
  useEffect(() => {
    if (defaultValues) {
      setCorteEvaluativo(defaultValues.corte || "");
      setAbriatura(defaultValues.abreviatura || "");
    }
  }, [defaultValues]);

  //funcion que guarda o edita
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSend = {
        corte: corteEvaluativo,
        abreviatura: abreviatura,
      };
      
      if (isEdit && defaultValues?.id) {
        await updateCorteEvaluativo(defaultValues.id, dataToSend);
        toast({
          title: "Registro actualizado",
          description: "El corte evaluativo se actualizó correctamente.",
          variant: "success",
        });
      } else {
        await saveCorteEvaluativo(dataToSend);
      }
      onSuccess();
    } catch (error) {
      console.error("Error al guardar o actualizar corteEvaluativo:", error);
      toast({
        title: "Error al guardar",
        description: "Ocurrió un error al guardar el corte. Intente nuevamente.",
        variant: "destructive",
      })
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto px-2">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        {isEdit ? "Editar Corte Evaluativo" : "Agregar Corte Evaluativo"}
      </h2>
      <input
        type="text"
        placeholder="Corte/parcial"
        value={corteEvaluativo}
        onChange={(e) => setCorteEvaluativo(e.target.value)}
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        required
      />
      <input
        type="text"
        placeholder="Abreviatura"
        value={abreviatura}
        onChange={(e) => setAbriatura(e.target.value)}
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        required
      />

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
