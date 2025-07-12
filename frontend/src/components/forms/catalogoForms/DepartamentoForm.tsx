import { saveDepartamento, updateDepartamento } from "@/actions/catalogos/departamentoMethods";
import { Departamento } from "@/interfaces";
import React, { useEffect, useState } from "react";

interface DepartamentoFormProps {
  defaultValues?: Departamento | null;
  onSuccess: () => void;
}

export default function DepartamentoForm({
  defaultValues,
  onSuccess,
}: DepartamentoFormProps) {
  const [departamento, setDepartamento] = useState<string>("");

  const isEdit = Boolean(defaultValues?.id);

  //rellenar los campos si va a editar
  useEffect(() => {
      if (defaultValues) {
        setDepartamento(defaultValues.departamento || "");
      }
    }, [defaultValues]);

    //funcion que gaurda o edita
  const handleSubmit = async (e: React.FormEvent)=>{
    e.preventDefault();
    try{
      if(isEdit && defaultValues?.id){
        await updateDepartamento(defaultValues.id, {departamento: departamento})
      } else {
        await saveDepartamento({departamento: departamento})
      }
      onSuccess();

    }catch (error) {
      console.error("Error al guardar o actualizar departamento:", error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto px-2">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">{isEdit ? "Editar Departamento" : "Agregar Departamento"}</h2>
      <input
        type="text"
        placeholder="Departamento"
        value={departamento}
        onChange={(e) => setDepartamento(e.target.value)}
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
