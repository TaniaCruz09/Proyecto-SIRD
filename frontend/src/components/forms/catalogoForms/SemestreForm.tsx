"use client"
import { saveSemestre, updateSemestre } from "@/actions/catalogos/semestreMethods";
import { useToast } from "@/hooks/use-toast";
import { Semestre } from "@/interfaces";
import React, { useEffect, useState } from "react";

interface SemestreFormProps {
  defaultValues?: Semestre | null;
  onSuccess: () => void;
}

export default function SemestreForm({
  defaultValues,
  onSuccess,
}: SemestreFormProps) {
  const { toast } = useToast();
  const [semestre, setSemestre] = useState<string>("");
  const [abreviatura, setAbreviatura] = useState<string>("");

  const isEdit = Boolean(defaultValues?.id);

  //rellenar los campos si va a editar
  useEffect(() => {
    if (defaultValues) {
      setSemestre(defaultValues.semestre || "");
      setAbreviatura(defaultValues.abreviatura || "");
    }
  }, [defaultValues]);

  //funcion que gaurda o edita
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSend = {
        semestre: semestre,
        abreviatura: abreviatura,

      };
      if (isEdit && defaultValues?.id) {
        await updateSemestre(defaultValues.id, dataToSend)
        toast({
          title: "Semestre actualizado",
          description: "El semestre se actualizo correctamente.",
          variant: "success",
        });
      } else {
        await saveSemestre(dataToSend)
        toast({
          title: "Semestre creado",
          description: "El semestre se creo correctamente.",
          variant: "success",
        });
      }
      onSuccess();

    } catch (error) {
      console.error("Error al guardar o actualizar Semestre:", error);
      toast({
        title: "Error al guardar",
        description: "No se pudo guardar el semestre.",
        variant: "destructive",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto px-2">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">{isEdit ? "Editar Semestre" : "Agregar Semestre"}</h2>
      <input
        type="text"
        placeholder="Semestre"
        value={semestre}
        onChange={(e) => setSemestre(e.target.value)}
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        required
      />
      <input
        type="text"
        placeholder="Abreviatura"
        value={abreviatura}
        onChange={(e) => setAbreviatura(e.target.value)}
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
