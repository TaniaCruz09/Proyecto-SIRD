"use client"

import { saveRoles, updateRoles } from "@/actions/authMethods/rolesMethods";
import Role from "@/interfaces/AuthInterface";
import { useEffect, useState } from "react";

interface RoleFormProps{
defaultValues?: Role | null;
  onSuccess: () => void;
}

const RoleForm = ({defaultValues, onSuccess }: RoleFormProps) => {
  const [rol, setRol] = useState("")

    const isEdit = Boolean(defaultValues?.id);

    useEffect(() => {
    if (defaultValues) {
      setRol(defaultValues.rol);
    }
  }, [defaultValues]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      if (isEdit && defaultValues?.id){
        const updateRol = await updateRoles(defaultValues.id, rol) //actualiza el rol
      } else {
        const newRol = await saveRoles(rol) //guarda el rol
        setRol(""); //limpia el rol
      }
      
    onSuccess?.(); // 7️⃣ Llama una función externa si fue pasada como prop (para cerrar modal o refrescar datos)
    } catch (error) {
      console.error("Error al Guardar Roles", error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        {isEdit ? "Editar Usuario" : "Agregar Usuario"}
      </h2>
      <input 
      type="text" 
      placeholder="Rol" 
      value={rol} 
      onChange={(e)=> setRol(e.target.value)} 
      className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
      required/>

      <div className="flex justify-center">
        <button
          type="submit"
          className="px-20 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
        >
          {isEdit ? "Actualizar" : "Guardar"}
        </button>
      </div>
    </form>

  );
};

export default RoleForm;
