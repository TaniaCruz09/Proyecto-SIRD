"use client"
import { savePais, updatePais } from "@/actions/catalogos/paisMethods";
import { useToast } from "@/hooks/use-toast";
import { Pais } from "@/interfaces";
import React, { useEffect, useState } from "react";

interface PaisFormProps {
  defaultValues?: Pais | null;
  onSuccess: () => void;
}

export default function PaisForm({
  defaultValues,
  onSuccess,
}: PaisFormProps) {
  const { toast } = useToast();
  const [pais, setPais] = useState<string>("");

  const isEdit = Boolean(defaultValues?.id);

  //rellenar los campos si va a editar
  useEffect(() => {
    if (defaultValues) {
      setPais(defaultValues.pais || "");
    }
  }, [defaultValues]);

  //funcion que gaurda o edita
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit && defaultValues?.id) {
        await updatePais(defaultValues.id, { pais: pais })
        toast({
          title: "Pais actualizado",
          description: "El pais se actualizo correctamente.",
          variant: "success",
        });
      } else {
        await savePais({ pais: pais })
        toast({
          title: "Pais creado",
          description: "El pais se creo correctamente.",
          variant: "success",
        });
      }
      onSuccess();

    } catch (error) {
      console.log(pais)
      console.error("Error al guardar o actualizar Pais:", error);
      toast({
        title: "Error al guardar",
        description: "No se pudo guardar el pais.",
        variant: "destructive",
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
       className="w-full max-w-md mx-auto space-y-6 bg-gradient-to-br from-white/95 to-indigo-50/90 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.1)] rounded-3xl px-8 py-8 border border-indigo-100 animate-fade-in"
    >
      <h2 className="text-2xl font-bold text-center text-indigo-800 mb-4">
        {isEdit ? "✏️ Editar Pais" : "📘 Agregar Pais"}
      </h2>

      <div>
        <input
          type="text"
          placeholder="Escriba el nombre del pais"
          value={pais}
          onChange={(e) => setPais(e.target.value)}
          className="w-full p-3 border rounded-2xl border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-300 placeholder-gray-400"
          required
        />
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          className="px-12 py-3 bg-indigo-500 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-600 hover:shadow-lg transition-all duration-200"
        >
          <span>
            {isEdit ? "Actualizar" : "Guardar"}
          </span>
        </button>
      </div>
    </form>
  );
}
