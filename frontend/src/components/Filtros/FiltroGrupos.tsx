"use client";

import { GrupoEscolar } from "@/interfaces";

interface FiltroGruposProps {
  grupos: GrupoEscolar[];
  selectedAnio: string;
  selectedModalidad: string;
  selectedGrado: string;
  onChangeAnio: (value: string) => void;
  onChangeModalidad: (value: string) => void;
  onChangeGrado: (value: string) => void;
  onClear: () => void;
}

export default function FiltroGrupos({
  grupos,
  selectedAnio,
  selectedModalidad,
  selectedGrado,
  onChangeAnio,
  onChangeModalidad,
  onChangeGrado,
  onClear,
}: FiltroGruposProps) {
  const aniosLectivos = Array.from(
    new Set(
      grupos
        .map((g) => g.organizacionEscolar?.anio_lectivo?.anio_lectivo)
        .filter((value): value is number => typeof value === "number")
    )
  ).sort((a, b) => b - a);

  const modalidades = Array.from(
    new Set(
      grupos
        .map((g) => g.turno?.modalidad?.modalidad)
        .filter((value): value is string => Boolean(value))
    )
  ).sort((a, b) => a.localeCompare(b));

  const grados = Array.from(
    new Set(
      grupos
        .map((g) => g.grado?.grades)
        .filter((value): value is string => Boolean(value))
    )
  ).sort((a, b) => a.localeCompare(b));

  const hasActiveFilters = Boolean(selectedAnio || selectedModalidad || selectedGrado);

  return (
    <div className="flex flex-wrap items-center gap-3 p-3">
      <select
        value={selectedAnio}
        onChange={(event) => onChangeAnio(event.target.value)}
        className="min-w-[170px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
      >
        <option value="">Anio lectivo</option>
        {aniosLectivos.map((anio) => (
          <option key={anio} value={String(anio)}>
            {anio}
          </option>
        ))}
      </select>

      <select
        value={selectedModalidad}
        onChange={(event) => onChangeModalidad(event.target.value)}
        className="min-w-[170px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
      >
        <option value="">Modalidad</option>
        {modalidades.map((modalidad) => (
          <option key={modalidad} value={modalidad}>
            {modalidad}
          </option>
        ))}
      </select>

      <select
        value={selectedGrado}
        onChange={(event) => onChangeGrado(event.target.value)}
        className="min-w-[170px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
      >
        <option value="">Grado</option>
        {grados.map((grado) => (
          <option key={grado} value={grado}>
            {grado}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={onClear}
        disabled={!hasActiveFilters}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Limpiar filtros
      </button>
    </div>
  );
}
