import { saveAnioLectivo, updateAnioLectivo } from "@/actions/catalogos/anioLectivoMethods";
import { AnioLectivo } from "@/interfaces";
import React, { useEffect, useState } from "react";

interface AnioLectivoFormProps {
  defaultValues?: AnioLectivo | null;
  onSuccess: () => void;
}

export default function ModalidadForm({
  defaultValues,
  onSuccess,
}: AnioLectivoFormProps) {
  const [anioLectivo, setAnioLectivo] = useState<number>(0);

  const isEdit = Boolean(defaultValues?.id);

  //rellenar los campos si va a editar
  useEffect(() => {
      if (defaultValues) {
        setAnioLectivo(defaultValues.anioLectivo);
      }
    }, [defaultValues]);

    //funcion que gaurda o edita
  const handleSubmit = async (e: React.FormEvent)=>{
    e.preventDefault();
    try{
      if(isEdit && defaultValues?.id){
        await updateAnioLectivo(defaultValues.id, {anioLectivo: anioLectivo})
      } else {
        await saveAnioLectivo({anioLectivo: anioLectivo})
      }
      onSuccess();

    }catch (error) {
      console.error("Error al guardar o actualizar año lectivo:", error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto px-2">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">{isEdit ? "Editar Año Lectivo" : "Agregar Año Lectivo"}</h2>
      <input
        type=""
        placeholder="Año Lectivo"
        value={anioLectivo}
        onChange={(e) => setAnioLectivo(parseInt(e.target.value))}
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
