import { saveEtnia, updateEtnia } from "@/actions/catalogos/etniaMethods";
import { Etnia } from "@/interfaces";
import React, { useEffect, useState } from "react";

interface EtniaFormProps {
  defaultValues?: Etnia | null;
  onSuccess: () => void;
}

export default function EtniaForm({
  defaultValues,
  onSuccess,
}: EtniaFormProps) {
  const [etnia, setEtnia] = useState<string>("");

  const isEdit = Boolean(defaultValues?.id);

  //rellenar los campos si va a editar
  useEffect(() => {
    if (defaultValues) {
      setEtnia(defaultValues.etnia || "");
    }
  }, [defaultValues]);

  //funcion que gaurda o edita
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit && defaultValues?.id) {
        await updateEtnia(defaultValues.id, { etnia })
      } else {
        await saveEtnia({ etnia })
      }
      onSuccess();

    } catch (error) {
      console.error("Error al guardar o actualizar la etnia:", error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto px-2">
      <h2 className="text-xl feont-semibold text-gray-700 emb-4">{isEdit ? "Editar Etnia" : "Agregar Etnia"}</h2>
      <input
        type="text"
        placeholder="Etnia"
        value={etnia}
        onChange={(e) => setEtnia(e.target.value)}
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
