import { saveModalidad, updateModalidad } from "@/actions/catalogos/modalidadMethods";
import { saveSexo, updateSexo } from "@/actions/catalogos/sexoMethods";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();
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
      if (isEdit && defaultValues?.id) {
        await updateSexo(defaultValues.id, { gender: sexo });
        toast({
          title: "Genero actualizado",
          description: "El genero se actualizo correctamente.",
          variant: "success",
        });
      } else {
        await saveSexo({ gender: sexo });
        toast({
          title: "Genero creado",
          description: "El genero se creo correctamente.",
          variant: "success",
        });
      }
      onSuccess();

    }catch (error) {
      console.error("Error al guardar o actualizar sexo:", error);
      toast({
        title: "Error al guardar",
        description: "No se pudo guardar el genero.",
        variant: "destructive",
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
       className="w-full max-w-md mx-auto space-y-6 bg-gradient-to-br from-white/95 to-indigo-50/90 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.1)] rounded-3xl px-8 py-8 border border-indigo-100 animate-fade-in"
    >
      <h2 className="text-2xl font-bold text-center text-indigo-800 mb-4">
        {isEdit ? "✏️ Editar Genero" : "📘 Agregar Genero"}
      </h2>

      <div>
        <input
          type="text"
          placeholder="Escriba el genero"
          value={sexo}
          onChange={(e) => setSexo(e.target.value)}
          className="w-full p-3 border rounded-2xl border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-300 placeholder-gray-400"
          required
        />
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          className="relative inline-flex items-center justify-center px-12 py-3 overflow-hidden font-semibold text-white transition-all duration-300 ease-out rounded-full shadow-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 hover:shadow-xl"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 blur-lg transition-all duration-300"></span>
          <span className="relative z-10">
            {isEdit ? "Actualizar" : "Guardar"}
          </span>
        </button>
      </div>
    </form>
  );
}
