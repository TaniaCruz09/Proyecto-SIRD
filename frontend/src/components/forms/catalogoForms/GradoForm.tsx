import { saveGrado, updateGrado } from "@/actions/catalogos/gradoMethods";
import { Grado } from "@/interfaces";
import React, { useEffect, useState } from "react";

interface GradoFormProps {
  defaultValues?: Grado | null;
  onSuccess: () => void;
}

export default function GradoForm({
  defaultValues,
  onSuccess,
}: GradoFormProps) {
  const [grado, setGrado] = useState<string>("");

  const isEdit = Boolean(defaultValues?.id);

  //rellenar los campos si va a editar
  useEffect(() => {
    if (defaultValues) {
      setGrado(defaultValues.grades || "");
    }
  }, [defaultValues]);

  //funcion que gaurda o edita
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit && defaultValues?.id) {
        await updateGrado(defaultValues.id, { grades: grado })
      } else {
        await saveGrado({ grades: grado })
      }
      onSuccess();

    } catch (error) {
      console.error("Error al guardar o actualizar Grado:", error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto px-2">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">{isEdit ? "Editar Grado" : "Agregar Grado"}</h2>
      <input
        type="text"
        placeholder="Grado"
        value={grado}
        onChange={(e) => setGrado(e.target.value)}
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
