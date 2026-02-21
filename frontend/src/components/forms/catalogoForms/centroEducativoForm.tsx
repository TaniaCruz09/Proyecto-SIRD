
import { getMunicipios } from "@/actions/catalogos/municipioMethods";
import { saveCentros, updateCentros } from "@/actions/centroMethods/centroEducativoMethods";
import { Municipio } from "@/interfaces";
import { CentroEscolar } from "@/interfaces/centroInterface";
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface CentroEducativoFormProps {
  defaultValues?: CentroEscolar | null;
  onSuccess: () => void;
}

export default function CentroEducativoForm({
  defaultValues,
  onSuccess,
}: CentroEducativoFormProps) {
  const { toast } = useToast();
  const [nombreCentro, setCentroEducativo] = useState<string>("");
  const [codigoEstablecimiento, setCodigoEstablecimiento] = useState<string>("");
  const [codigoCentro, setCodigoCentro] = useState<string>("");
  const [direccionCentro, setDireccion] = useState<string>("");
  const [municipio, setMunicipio] = useState<string>("");

  const isEdit = Boolean(defaultValues?.id);

  const [municipios, setMunicipios] = useState<Municipio[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          municipiosData
        ] = await Promise.all([
          getMunicipios(),

        ]);
        setMunicipios(municipiosData);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };
    fetchData();
  }, []);

  //rellenar los campos si va a editar
  useEffect(() => {
    if (defaultValues) {
      setCentroEducativo(defaultValues.nombreCentro || "");
      setCodigoEstablecimiento(defaultValues.codigoEstablecimiento || "")
      setCodigoCentro(defaultValues.codigoCentro || "")
      setDireccion(defaultValues.direccionCentro || "")
      setMunicipio(defaultValues.municipio?.id?.toString() || "");
    }
  }, [defaultValues]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const selectedMunicipio = municipios.find(
      (s) => s.id === parseInt(municipio)
    );

    if (!selectedMunicipio) {
      toast({
        title: "Campos incompletos",
        description: "Por favor complete todos los campos requeridos.",
        variant: "warning",
      });
      return;
    }

    const payload = {
      nombreCentro,
      codigoEstablecimiento,
      codigoCentro,
      direccionCentro,
      municipio: { id: selectedMunicipio.id },
    };

    if (isEdit && defaultValues?.id) {
      await updateCentros(defaultValues.id, payload);
      toast({
        title: "Centro actualizado",
        description: "Los datos del centro se actualizaron correctamente.",
        variant: "success",
      });
    } else {
      await saveCentros(payload);
      toast({
        title: "Centro creado",
        description: "El centro se registró correctamente.",
        variant: "success",
      });
    }

    onSuccess();
  } catch (error) {
    console.error("Error al guardar el centro:", error);
    toast({
      title: "Error al guardar",
      description: "No se pudo guardar el centro educativo.",
      variant: "destructive",
    });
  }
};


  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto space-y-6 bg-gradient-to-br from-white/95 to-indigo-50/90 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.1)] rounded-3xl px-8 py-8 border border-indigo-100 animate-fade-in"
    >
      <h2 className="text-2xl font-bold text-center text-indigo-800 mb-4">
        {isEdit ? "✏️ Editar nombreCentro" : "📘 Agregar nombreCentro"}
      </h2>

      <div>
        <label className="block text-gray-700 font-medium mb-1">Nombres del centro</label>
        <input
          type="text"
          placeholder="Escriba la nombreCentro"
          value={nombreCentro}
          onChange={(e) => setCentroEducativo(e.target.value)}
          className="w-full p-3 border rounded-2xl border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-300 placeholder-gray-400"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-1">Codigo del establecimiento</label>
        <input
          type="text"
          placeholder="codigo del establecimiento"
          value={codigoEstablecimiento}
          onChange={(e) => setCodigoEstablecimiento(e.target.value)}
          className="w-full p-3 border rounded-2xl border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-300 placeholder-gray-400"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-1">Codigo del centro</label>
        <input
          type="text"
          placeholder="codigo del centro"
          value={codigoCentro}
          onChange={(e) => setCodigoCentro(e.target.value)}
          className="w-full p-3 border rounded-2xl border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-300 placeholder-gray-400"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-1">Direccion</label>
        <input
          type="text"
          placeholder="Dirrecion del centro"
          value={direccionCentro}
          onChange={(e) => setDireccion(e.target.value)}
          className="w-full p-3 border rounded-2xl border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-300 placeholder-gray-400"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-1">Municipio</label>
        <select
          value={municipio}
          onChange={(e) => setMunicipio(e.target.value)}
          className="input-style"
          required
        >
          <option value="">Seleccionar municipio</option>
          {municipios.map((r) => (
            <option key={r.id} value={r.id}>{r.municipio}</option>
          ))}
        </select>
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
