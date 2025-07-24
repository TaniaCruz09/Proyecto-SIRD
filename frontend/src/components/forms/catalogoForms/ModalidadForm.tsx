import { saveModalidad, updateModalidad } from "@/actions/catalogos/modalidadMethods";
import { Modalidad } from "@/interfaces";
import React, { useEffect, useState } from "react";

interface ModalidadFormProps {
  defaultValues?: Modalidad | null;
  onSuccess: () => void;
}

export default function ModalidadForm({
  defaultValues,
  onSuccess,
}: ModalidadFormProps) {
  const [modalidad, setModalidad] = useState<string>("");

  const isEdit = Boolean(defaultValues?.id);

  //rellenar los campos si va a editar
  useEffect(() => {
      if (defaultValues) {
        setModalidad(defaultValues.modalidad || "");
      }
    }, [defaultValues]);

    //funcion que gaurda o edita
  const handleSubmit = async (e: React.FormEvent)=>{
    e.preventDefault();
    try{
      if(isEdit && defaultValues?.id){
        await updateModalidad(defaultValues.id, {modalidad: modalidad})
      } else {
        await saveModalidad({modalidad: modalidad})
      }
      onSuccess();

    }catch (error) {
      console.error("Error al guardar o actualizar modalidad:", error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto px-2">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">{isEdit ? "Editar Modalidad" : "Agregar Modalidad"}</h2>
      <input
        type="text"
        placeholder="Modalidad"
        value={modalidad}
        onChange={(e) => setModalidad(e.target.value)}
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
