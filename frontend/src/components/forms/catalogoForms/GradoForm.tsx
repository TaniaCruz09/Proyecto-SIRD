import { saveGrado, updateGrado } from "@/actions/catalogos/gradoMethods";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();
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
        toast({
          title: "Registro actualizado",
          description: "El grado se actualizo correctamente.",
          variant: "success",
        });
      } else {
        await saveGrado({ grades: grado })
        toast({
          title: "Registro guardado",
          description: "El grado se guardo correctamente.",
          variant: "success",
        });
      }
      onSuccess();

    } catch (error) {
      console.error("Error al guardar o actualizar Grado:", error);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
       className="w-full max-w-md mx-auto space-y-6 bg-gradient-to-br from-white/95 to-indigo-50/90 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.1)] rounded-3xl px-8 py-8 border border-indigo-100 animate-fade-in"
    >
      <h2 className="text-2xl font-bold text-center text-indigo-800 mb-4">
        {isEdit ? "✏️ Editar Grado" : "📘 Agregar Grado"}
      </h2>

      <div>
        <input
          type="text"
          placeholder="Escriba el grado"
          value={grado}
          onChange={(e) => setGrado(e.target.value)}
          className="w-full p-3 border rounded-2xl border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-300 placeholder-gray-400"
          required
        />
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          className="px-12 py-3 bg-indigo-500 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-600 hover:shadow-lg transition-all duration-200"
        >
          <span>
            {isEdit ? "Actualizar" : "Guardar"}
          </span>
        </button>
      </div>
    </form>
  );
}
