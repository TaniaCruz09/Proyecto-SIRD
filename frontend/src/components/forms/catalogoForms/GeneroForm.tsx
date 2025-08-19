import { saveModalidad, updateModalidad } from "@/actions/catalogos/modalidadMethods";
import { saveSexo, updateSexo } from "@/actions/catalogos/sexoMethods";
import { Sexo } from "@/interfaces";
import React, { useEffect, useState } from "react";

interface SexoFormProps {
  defaultValues?: Sexo | null;
  onSuccess: () => void;
}

export default function SexoForm({
  defaultValues,
  onSuccess,
}: SexoFormProps) {
  const [sexo, setSexo] = useState<string>("");

  const isEdit = Boolean(defaultValues?.id);

  //rellenar los campos si va a editar
  useEffect(() => {
      if (defaultValues) {
        setSexo(defaultValues.gender || "");
      }
    }, [defaultValues]);

    //funcion que guarda o edita
  const handleSubmit = async (e: React.FormEvent)=>{
    e.preventDefault();
    try{
      if(isEdit && defaultValues?.id){
        await updateSexo(defaultValues.id, {gender: sexo})
      } else {
        await saveSexo({gender: sexo})
      }
      onSuccess();

    }catch (error) {
      console.error("Error al guardar o actualizar sexo:", error); 
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto px-2">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">{isEdit ? "Editar Sexo" : "Agregar Sexo"}</h2>
      <input
        type="text"
        placeholder="Sexo"
        value={sexo}
        onChange={(e) => setSexo(e.target.value)}
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
