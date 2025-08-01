import { saveNivelAcademico, updateNivelAcademico } from "@/actions/catalogos/academicLevelMethods";
import { NivelAcademico } from "@/interfaces";
import React, { useEffect, useState } from "react";

interface NivelAcademicoFormProps {
  defaultValues?: NivelAcademico | null;
  onSuccess: () => void;
}

export default function NivelAcademicoForm({
  defaultValues,
  onSuccess,
}: NivelAcademicoFormProps) {
  const [nivelAcademico, setNivelAcademico] = useState<string>("");

  const isEdit = Boolean(defaultValues?.id);

  //rellenar los campos si va a editar
  useEffect(() => {
    if (defaultValues) {
      setNivelAcademico(defaultValues.academicLevel || "");
    }
  }, [defaultValues]);

  //funcion que gaurda o edita
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit && defaultValues?.id) {
        await updateNivelAcademico(defaultValues.id, { academicLevel: nivelAcademico })
      } else {
        await saveNivelAcademico({ academicLevel: nivelAcademico })
      }
      onSuccess();

    } catch (error) {
      console.error("Error al guardar o actualizar Nivel Academico:", error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto px-2">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">{isEdit ? "Editar Nivel Academico" : "Agregar Nivel Academico"}</h2>
      <input
        type="text"
        placeholder="Nivel Academico"
        value={nivelAcademico}
        onChange={(e) => setNivelAcademico(e.target.value)}
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
