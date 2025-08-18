"use client";

import React, { useEffect, useState } from "react";
import Select, { MultiValue, SingleValue } from "react-select";
import { getAsignaturas } from "@/actions/catalogos/asignaturaMethods";
import { getGrupos } from "@/actions/organizacionEscolarMethods/GrupoEscolarMethods/GrupoEscolarMethods";
import { Asignatura, GrupoEscolar } from "@/interfaces";

interface GrupoConAsignaturas {
  grupoId: number | null;
  asignaturasIds: number[];
}

interface Props {
  organizacionLaboralId: number;
  defeaultValues?: { grupos: GrupoConAsignaturas[] } | null;
  onSuccess?: () => void;
  onSubmitForm: (data: {
    organizacionLaboralId: number;
    grupos: { grupoId: number; asignaturasIds: number[] }[];
  }) => Promise<void>;
}

export default function AsignaturaGruposForm({
  organizacionLaboralId,
  defeaultValues,
  onSuccess,
  onSubmitForm,
}: Props) {
  const [gruposRelacion, setGruposRelacion] = useState<GrupoEscolar[]>([]);
  const [asignaturasRelacion, setAsignaturasRelacion] = useState<Asignatura[]>([]);

  const [gruposAsignados, setGruposAsignados] = useState<GrupoConAsignaturas[]>([
    { grupoId: null, asignaturasIds: [] },
  ]);

  // Cargar grupos y asignaturas desde backend, igual que en tu otro formulario
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gruposData, asignaturasData] = await Promise.all([getGrupos(), getAsignaturas()]);
        setGruposRelacion(gruposData);
        setAsignaturasRelacion(asignaturasData);
      } catch (error) {
        console.error("Error cargando grupos o asignaturas:", error);
      }
    };
    fetchData();
  }, []);

  // Precargar valores por defecto si vienen
  useEffect(() => {
    if (!defeaultValues) return;
    if (Array.isArray(defeaultValues.grupos) && defeaultValues.grupos.length > 0) {
      setGruposAsignados(defeaultValues.grupos);
    }
  }, [defeaultValues]);

  // Opciones para los selects con estilo simple, parecido al otro formulario
  const grupoOptions = gruposRelacion.map((g) => ({
    value: g.id,
    label: `${g.grado?.grades || ""} - ${g.modalidad?.modalidad || ""} - ${g.turno?.turno || ""} - ${g.seccion?.seccion || ""}`,
  }));

  const asignaturaOptions = asignaturasRelacion.map((a) => ({
    value: a.id,
    label: a.asignatura || `Asignatura ${a.id}`,
  }));

  const handleGrupoChange = (index: number, selected: SingleValue<{ value: number; label: string }>) => {
    setGruposAsignados((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], grupoId: selected ? selected.value : null };
      return copy;
    });
  };

  const handleAsignaturasChange = (index: number, selected: MultiValue<{ value: number; label: string }>) => {
    const ids = selected ? selected.map((s) => s.value) : [];
    setGruposAsignados((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], asignaturasIds: ids };
      return copy;
    });
  };

  const addGrupo = () => {
    setGruposAsignados((prev) => [...prev, { grupoId: null, asignaturasIds: [] }]);
  };

  const removeGrupo = (index: number) => {
    setGruposAsignados((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación sencilla igual que en tu ejemplo
    for (const item of gruposAsignados) {
      if (!item.grupoId) {
        alert("Por favor selecciona todos los grupos.");
        return;
      }
      if (!item.asignaturasIds || item.asignaturasIds.length === 0) {
        alert("Por favor asigna asignaturas a todos los grupos.");
        return;
      }
    }

    const payload = {
      organizacionLaboralId,
      grupos: gruposAsignados.map((g) => ({ grupoId: g.grupoId!, asignaturasIds: g.asignaturasIds })),
    };

    try {
      await onSubmitForm(payload);
      onSuccess?.();
    } catch (error) {
      console.error("Error guardando asignaciones:", error);
      alert("Error guardando asignaciones. Revisa la consola.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto px-2 max-h-[70vh]">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Asignar grupos y asignaturas a la organización laboral {organizacionLaboralId}
      </h2>

      {gruposAsignados.map((grupoItem, index) => (
        <div key={index} className="border p-4 rounded-xl mb-4 bg-gray-50 relative">
          <button
            type="button"
            onClick={() => removeGrupo(index)}
            className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold text-xl leading-none"
            aria-label="Eliminar grupo"
          >
            &times;
          </button>

          <label className="block mb-2 font-medium text-gray-700">Grupo</label>
          <Select
            options={grupoOptions}
            value={grupoOptions.find((opt) => opt.value === grupoItem.grupoId) || null}
            onChange={(selected) => handleGrupoChange(index, selected)}
            placeholder="Selecciona un grupo"
            className="mb-4 text-black"
            classNamePrefix="react-select"
          />

          <label className="block mb-2 font-medium text-gray-700">Asignaturas</label>
          <Select
            isMulti
            options={asignaturaOptions}
            value={asignaturaOptions.filter((opt) => grupoItem.asignaturasIds.includes(opt.value))}
            onChange={(selected) => handleAsignaturasChange(index, selected)}
            placeholder="Selecciona asignaturas"
            className="text-black"
            classNamePrefix="react-select"
          />
        </div>
      ))}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={addGrupo}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          + Agregar otro grupo
        </button>

        <button
          type="submit"
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Guardar asignaciones
        </button>
      </div>
    </form>
  );
}
