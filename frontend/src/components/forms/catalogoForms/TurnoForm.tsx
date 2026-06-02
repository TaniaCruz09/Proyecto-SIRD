
import { getModalidades } from "@/actions/catalogos/modalidadMethods";
import { saveTurno, updateTurno } from "@/actions/catalogos/turnoMethods";
import { useToast } from "@/hooks/use-toast";
import { Modalidad, Turno, TurnoPayload } from "@/interfaces";
import React, { useEffect, useState } from "react";

interface TurnoFormProps {
  defaultValues?: Turno | null;
  onSuccess: () => void;
}

export default function TurnoForm({
  defaultValues,
  onSuccess,
}: TurnoFormProps) {
  const { toast } = useToast();
  const [turno, setTurno] = useState<string>("");
  const [modalidad, setModalidad] = useState<Modalidad |null>(null);
  const [modalidades, setModalidades] = useState<Modalidad[]>([]);

  const isEdit = Boolean(defaultValues?.id);

  useEffect(() => {
    const fetchModalidades = async () => {
      const data = await getModalidades();
      setModalidades(data);
    };

    fetchModalidades();
  },[]);

  //rellenar los campos si va a editar
  useEffect(() => {
    if (!defaultValues) {
      setTurno("");
      setModalidad(null);
      return;
    }

    setTurno(defaultValues.turno || "");

    if (defaultValues.modalidad) {
      const selectedModalidad = modalidades.find(
        (item) => item.id === defaultValues.modalidad?.id
      );
      setModalidad(selectedModalidad ?? defaultValues.modalidad);
    }
  }, [defaultValues, modalidades]);

  //funcion que gaurda o edita
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!modalidad) {
      alert("Debes seleccionar una modalidad");
      return;
    }

    const turnoData: TurnoPayload = {
      turno,
      modalidad,
    };

    try {
      if (isEdit && defaultValues?.id) {
        await updateTurno(defaultValues.id, turnoData)
        toast({
          title: "Registro actualizado",
          description: "El turno se actualizo correctamente.",
          variant: "success",
        });
      } else {
        await saveTurno(turnoData)
        toast({
          title: "Registro guardado",
          description: "El turno se guardo correctamente.",
          variant: "success",
        });
      }
      onSuccess();

    } catch (error) {
      console.error("Error al guardar o actualizar turno:", error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto px-2">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">{isEdit ? "Editar Turno" : "Agregar Turno"}</h2>
      <input
        type="text"
        placeholder="Turno"
        value={turno}
        onChange={(e) => setTurno(e.target.value)}
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        required
      />

      <select 
      value={modalidad?.id || ""}
      onChange={(e) => {
       const selectedDep = modalidades.find (dep => dep.id === Number(e.target.value));   // conveertimos el string de modalidad a # para comparar 
          setModalidad(selectedDep || null)}} 
        className="w-full p-3 border rounded-xl border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
        required
      >
        <option value="">Selecciona una modalidad</option>
        {modalidades.map((dep) => (
          <option key={dep.id} value={dep.id}>
            {dep.modalidad}
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
