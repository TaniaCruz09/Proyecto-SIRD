"use client"

import { getRoles, saveRoles, updateRoles } from "@/actions/authMethods/rolesMethods";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Role } from "@/interfaces/authInterface";

interface RoleFormProps{
defaultValues?: Role | null;
  onSuccess: () => void;
}

const RoleForm = ({defaultValues, onSuccess }: RoleFormProps) => {
  const { toast } = useToast();
  const [rol, setRol] = useState("")
  const [isActive, setIsActive] = useState(true)

    const isEdit = Boolean(defaultValues?.id);

    useEffect(() => {
    if (defaultValues) {
      setRol(defaultValues.rol);
      setIsActive(defaultValues.isActive ?? true)
    }
  }, [defaultValues]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      if (isEdit && defaultValues?.id){
        const updateRol = await updateRoles(defaultValues.id, rol, isActive) //actualiza el rol
      } else {
        const newRol = await saveRoles(rol, isActive) //guarda el rol
        setRol(""); //limpia el rol
        setIsActive(true)
        toast({
          title: "Rol agregado",
          description: "Rol agregado correctamente.",
          variant: "success",
        })
      }
      
    onSuccess?.(); // 7️⃣ Llama una función externa si fue pasada como prop (para cerrar modal o refrescar datos)
    } catch (error) {
      const message = error instanceof Error ? error.message : ""

      if (message.includes("Deleted role exists")) {
        toast({
          title: "Rol eliminado",
          description: "Existe un rol eliminado con ese nombre. Puedes restaurarlo(vuelve a crearlo) o cambia el nombre.",
          variant: "destructive",
        })
        return
      }
      if (message.includes("Role already exists")) {
        toast({
          title: "Rol duplicado",
          description: "Ya existe un rol con ese mismo nombre.",
          variant: "destructive",
        })
        return
      }
      toast({
        title: "Error al guardar",
        description: "No se pudo guardar el rol.",
        variant: "destructive",
      })
      console.error("Error al Guardar Roles", error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        {isEdit ? "Editar Rol" : "Agregar Rol"}
      </h2>
      <input 
      type="text" 
      placeholder="Rol" 
      value={rol} 
      onChange={(e)=> setRol(e.target.value)} 
      className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
      required/>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Estado del Rol</label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={isActive}
            onClick={() => setIsActive((prev) => !prev)}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
              isActive ? "bg-indigo-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                isActive ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-sm text-gray-700">
            {isActive ? "Activo" : "Inactivo"}
          </span>
        </div>
      </div>

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
