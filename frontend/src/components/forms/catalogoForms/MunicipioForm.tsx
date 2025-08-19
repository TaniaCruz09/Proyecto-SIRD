import { saveMunicipio, updateMunicipio } from "@/actions/catalogos/municipioMethods";
import { updateModalidad } from "@/actions/catalogos/modalidadMethods";
import { Departamento, Municipio, MunicipioPayload } from "@/interfaces";
import React, { useEffect, useState } from "react";
import { getDepartamentos } from "@/actions/catalogos/departamentoMethods";

interface MunicipioFormProps {
  defaultValues?: Municipio | null;
  onSuccess: () => void;
}

export default function MunicipioForm({
  defaultValues,
  onSuccess,
}: MunicipioFormProps) {
  const [municipio, setMunicipio] = useState<string>("");
  const [departamento, setDepartamento] = useState<Departamento |null>(null);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);

  const isEdit = Boolean(defaultValues?.id);

  // Cargar departamentos
  useEffect(() => {
  const fetchDepartamentos = async () => {
    try {
      const data = await getDepartamentos();
      setDepartamentos(data);
    } catch (error) {
      console.error("Error al cargar departamentos:", error);
    }
  };

  fetchDepartamentos();
}, []);

  // Rellenar datos si va a editar
  useEffect(() => {
    if (defaultValues) {
      setMunicipio(defaultValues.municipio || "");
      setDepartamento(defaultValues.departamento || null);
    }
  }, [defaultValues]);

  // Guardar o actualizar
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

     // Muestra error o evita enviar el formulario si no hay departamento seleccionado
    if (!departamento) {
  alert("Debes seleccionar un departamento");
  return;
}

    const municipioData: MunicipioPayload = {
      municipio,
      departamento,
    };

    try {
      if (isEdit && defaultValues?.id) {
        await updateMunicipio(defaultValues.id, municipioData);
      } else {
        await saveMunicipio(municipioData);
      }
      onSuccess();
    } catch (error) {
      console.error("Error al guardar o actualizar municipio:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto px-2">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        {isEdit ? "Editar Municipio" : "Agregar Municipio"}
      </h2>

      <input
        type="text"
        placeholder="Municipio"
        value={municipio}
        onChange={(e) => setMunicipio(e.target.value)}
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        required
      />

      <select
        value={departamento?.id || ""}
        onChange={(e) => {
          const selectedDep = departamentos.find (dep => dep.id === Number(e.target.value));   // conveertimos el string de departamento a # para comparar 
          setDepartamento(selectedDep || null)}} 
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        required
      >
        <option value="">Selecciona un departamento</option>
        {departamentos.map((dep) => (
          <option key={dep.id} value={dep.id}>
            {dep.departamento}
          </option>
        ))}
      </select>

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
