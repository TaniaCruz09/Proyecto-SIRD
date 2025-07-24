"use client"

import NavbarAdmin from "@/components/navbarAdmin";
import { useState, useMemo } from "react";

type Materia = string;

type NotasCuantitativas = {
  [key: string]: number; // materia -> nota numérica
};

type NotasCualitativas = {
  [key: string]: string; // materia -> descripción cualitativa (ej: Aprobado, Excelente)
};

type Estudiante = {
  id: number;
  nombre: string;
  notasCuantitativas: NotasCuantitativas;
  notasCualitativas: NotasCualitativas;
};

type Seccion = {
  id: number;
  grado: string;
  letra: string;
  turno: string;
  modalidad: string;
  maestroGuia: string;
  estudiantes: Estudiante[];
  anioEscolar: number;
};

// Datos de ejemplo
const seccionesMock: Seccion[] = [
  {
    id: 1,
    grado: "6°",
    letra: "A",
    turno: "Matutino",
    modalidad: "Presencial",
    maestroGuia: "Prof. Juan Pérez",
    anioEscolar: 2024,
    estudiantes: [
      {
        id: 1,
        nombre: "Ana López",
        notasCuantitativas: { matematicas: 85, ciencias: 88 },
        notasCualitativas: { conducta: "Excelente", participacion: "Buena" },
      },
      {
        id: 2,
        nombre: "Carlos Martínez",
        notasCuantitativas: { matematicas: 78, ciencias: 80 },
        notasCualitativas: { conducta: "Regular", participacion: "Muy Buena" },
      },
    ],
  },
  {
    id: 2,
    grado: "7°",
    letra: "B",
    turno: "Vespertino",
    modalidad: "Virtual",
    maestroGuia: "Prof. María Gómez",
    anioEscolar: 2024,
    estudiantes: [
      {
        id: 3,
        nombre: "Luisa Torres",
        notasCuantitativas: { matematicas: 95, ciencias: 92 },
        notasCualitativas: { conducta: "Excelente", participacion: "Excelente" },
      },
    ],
  },
  {
    id: 3,
    grado: "6°",
    letra: "A",
    turno: "Matutino",
    modalidad: "Presencial",
    maestroGuia: "Prof. Carlos Ruiz",
    anioEscolar: 2025,
    estudiantes: [
      {
        id: 4,
        nombre: "Pedro Gómez",
        notasCuantitativas: { matematicas: 80, ciencias: 90 },
        notasCualitativas: { conducta: "Buena", participacion: "Buena" },
      },
    ],
  },
];

// Extract unique values helper
const uniqueValues = (items: any[], key: string) =>
  Array.from(new Set(items.map((i) => i[key]))).sort();

const cortes = ["Corte 1", "Corte 2", "Corte 3", "Corte 4"];

export default function SeccionEstilizada() {
  // Buscador años
  const [busquedaAnio, setBusquedaAnio] = useState("");
  const aniosFiltrados = useMemo(() => {
    const anios = uniqueValues(seccionesMock, "anioEscolar");
    if (!busquedaAnio) return anios;
    return anios.filter((a) => a.toString().includes(busquedaAnio));
  }, [busquedaAnio]);

  // Estado selección progresiva
  const [anioSeleccionado, setAnioSeleccionado] = useState<number>(aniosFiltrados[0] || 0);

  // Modalidades filtradas por año
  const modalidades = useMemo(() => {
    return Array.from(
      new Set(
        seccionesMock
          .filter((s) => s.anioEscolar === anioSeleccionado)
          .map((s) => s.modalidad)
      )
    ).sort();
  }, [anioSeleccionado]);

  const [modalidadSeleccionada, setModalidadSeleccionada] = useState<string>(
    modalidades[0] || ""
  );

  // Turnos filtrados por año y modalidad
  const turnos = useMemo(() => {
    return Array.from(
      new Set(
        seccionesMock
          .filter(
            (s) =>
              s.anioEscolar === anioSeleccionado && s.modalidad === modalidadSeleccionada
          )
          .map((s) => s.turno)
      )
    ).sort();
  }, [anioSeleccionado, modalidadSeleccionada]);

  const [turnoSeleccionado, setTurnoSeleccionado] = useState<string>(turnos[0] || "");

  // Secciones filtradas por año, modalidad y turno
  const seccionesFiltradas = useMemo(() => {
    return seccionesMock.filter(
      (s) =>
        s.anioEscolar === anioSeleccionado &&
        s.modalidad === modalidadSeleccionada &&
        s.turno === turnoSeleccionado
    );
  }, [anioSeleccionado, modalidadSeleccionada, turnoSeleccionado]);

  const [seccionId, setSeccionId] = useState<number>(seccionesFiltradas[0]?.id || -1);

  const seccionSeleccionada = seccionesMock.find((s) => s.id === seccionId);

  // Corte y filtro de estudiantes
  const [corteActual, setCorteActual] = useState<string>(cortes[0]);
  const [filtroNombre, setFiltroNombre] = useState("");

  // Modal edición
  const [estudianteActivo, setEstudianteActivo] = useState<Estudiante | null>(null);
  const [notasCuantEdit, setNotasCuantEdit] = useState<NotasCuantitativas>({});
  const [notasCualiEdit, setNotasCualiEdit] = useState<NotasCualitativas>({});

  // Al cambiar filtros, resetear selecciones si ya no existen
  if (!aniosFiltrados.includes(anioSeleccionado)) {
    setAnioSeleccionado(aniosFiltrados[0] || 0);
  }
  if (!modalidades.includes(modalidadSeleccionada)) {
    setModalidadSeleccionada(modalidades[0] || "");
  }
  if (!turnos.includes(turnoSeleccionado)) {
    setTurnoSeleccionado(turnos[0] || "");
  }
  if (!seccionesFiltradas.some((s) => s.id === seccionId)) {
    setSeccionId(seccionesFiltradas[0]?.id || -1);
  }

  const abrirModal = (estudiante: Estudiante) => {
    setEstudianteActivo(estudiante);
    setNotasCuantEdit(estudiante.notasCuantitativas);
    setNotasCualiEdit(estudiante.notasCualitativas);
  };

  const guardarNotas = () => {
    if (!estudianteActivo) return;
    console.log(
      `Guardar notas de ${estudianteActivo.nombre} en ${corteActual}:`,
      { cuantitativas: notasCuantEdit, cualitativas: notasCualiEdit }
    );
    setEstudianteActivo(null);
  };

  const estudiantesFiltrados = seccionSeleccionada
    ? seccionSeleccionada.estudiantes.filter((e) =>
        e.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
      )
    : [];

  // Materias de ejemplo para cada tipo
  const materiasCuantitativas = ["matematicas", "ciencias"];
  const materiasCualitativas = ["conducta", "participacion"];

  return (
    <div className="flex h-screen ">
        <div>
            <NavbarAdmin/>
        </div>
    <div className="w-screen p-6 bg-gray-100 max-w-7xl mx-auto space-y-8 min-h-screen">
      {/* Título */}
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Gestión de Secciones y Notas</h1>

      {/* Contenedores para filtros con sombra y borde redondeado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Buscar año escolar */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <label className="block text-gray-700 font-semibold mb-2">Buscar año escolar:</label>
          <input
            type="text"
            placeholder="Ej. 2024"
            value={busquedaAnio}
            onChange={(e) => setBusquedaAnio(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        {/* Selección año */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <label className="block text-gray-700 font-semibold mb-2">Año escolar:</label>
          <select
            value={anioSeleccionado}
            onChange={(e) => setAnioSeleccionado(parseInt(e.target.value))}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            {aniosFiltrados.map((anio) => (
              <option key={anio} value={anio}>
                {anio}
              </option>
            ))}
          </select>
        </div>

        {/* Modalidad */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <label className="block text-gray-700 font-semibold mb-2">Modalidad:</label>
          <select
            value={modalidadSeleccionada}
            onChange={(e) => setModalidadSeleccionada(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            {modalidades.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Turno */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <label className="block text-gray-700 font-semibold mb-2">Turno:</label>
          <select
            value={turnoSeleccionado}
            onChange={(e) => setTurnoSeleccionado(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            {turnos.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Sección */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <label className="block text-gray-700 font-semibold mb-2">Sección:</label>
          <select
            value={seccionId}
            onChange={(e) => setSeccionId(parseInt(e.target.value))}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            {seccionesFiltradas.length === 0 ? (
              <option>No hay secciones</option>
            ) : (
              seccionesFiltradas.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.grado} {s.letra}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Corte */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <label className="block text-gray-700 font-semibold mb-2">Corte:</label>
          <select
            value={corteActual}
            onChange={(e) => setCorteActual(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            {cortes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Buscar estudiante */}
      <div className="max-w-md mx-auto">
        <label className="block text-gray-700 font-semibold mb-2">Buscar estudiante:</label>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>

      {/* Tabla */}
      {seccionSeleccionada ? (
        <div className="overflow-x-auto mt-6 shadow-lg rounded-lg bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-6 py-3 text-center text-sm font-semibold">#</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Estudiante</th>
                {materiasCuantitativas.map((m) => (
                  <th key={m} className="px-6 py-3 text-left text-sm font-semibold">
                    {m} (Cuantitativa)
                  </th>
                ))}
                {materiasCualitativas.map((m) => (
                  <th key={m} className="px-6 py-3 text-left text-sm font-semibold">
                    {m} (Cualitativa)
                  </th>
                ))}
                <th className="px-6 py-3 text-center text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {estudiantesFiltrados.length === 0 && (
                <tr>
                  <td
                    colSpan={
                      3 + materiasCuantitativas.length + materiasCualitativas.length
                    }
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No hay estudiantes que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
              {estudiantesFiltrados.map((est, idx) => (
                <tr
                  key={est.id}
                  className="hover:bg-indigo-50 transition cursor-pointer"
                >
                  <td className="px-6 py-4 text-center text-sm">{idx + 1}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {est.nombre}
                  </td>
                  {materiasCuantitativas.map((m) => (
                    <td key={m} className="px-6 py-4 text-sm text-gray-700">
                      {est.notasCuantitativas[m] ?? "-"}
                    </td>
                  ))}
                  {materiasCualitativas.map((m) => (
                    <td key={m} className="px-6 py-4 text-sm text-gray-700">
                      {est.notasCualitativas[m] ?? "-"}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => abrirModal(est)}
                      className="inline-block rounded-md bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-red-600 font-semibold mt-8">
          No hay sección seleccionada.
        </p>
      )}

      {/* Modal edición */}
      {estudianteActivo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="relative w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-8 shadow-xl max-h-[90vh]">
            <button
              onClick={() => setEstudianteActivo(null)}
              className="absolute right-6 top-6 rounded-full bg-gray-200 p-2 text-gray-700 hover:bg-gray-300 transition"
              aria-label="Cerrar modal"
            >
              ✕
            </button>
            <h3 className="mb-6 text-2xl font-bold text-gray-900">
              Editar notas – {estudianteActivo.nombre}
            </h3>

            <form className="space-y-6">
              {/* Cuantitativas */}
              <div>
                <h4 className="mb-3 border-b border-gray-300 pb-1 font-semibold text-gray-700">
                  Notas Cuantitativas
                </h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {materiasCuantitativas.map((materia) => (
                    <div key={materia}>
                      <label
                        htmlFor={`cuant-${materia}`}
                        className="block mb-1 text-sm font-medium capitalize text-gray-700"
                      >
                        {materia}
                      </label>
                      <input
                        id={`cuant-${materia}`}
                        type="number"
                        min={0}
                        max={100}
                        value={notasCuantEdit[materia] ?? ""}
                        onChange={(e) =>
                          setNotasCuantEdit({
                            ...notasCuantEdit,
                            [materia]: e.target.value === "" ? 0 : parseFloat(e.target.value),
                          })
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Cualitativas */}
              <div>
                <h4 className="mb-3 border-b border-gray-300 pb-1 font-semibold text-gray-700">
                  Notas Cualitativas
                </h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {materiasCualitativas.map((materia) => (
                    <div key={materia}>
                      <label
                        htmlFor={`cuali-${materia}`}
                        className="block mb-1 text-sm font-medium capitalize text-gray-700"
                      >
                        {materia}
                      </label>
                      <input
                        id={`cuali-${materia}`}
                        type="text"
                        value={notasCualiEdit[materia] ?? ""}
                        onChange={(e) =>
                          setNotasCualiEdit({
                            ...notasCualiEdit,
                            [materia]: e.target.value,
                          })
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setEstudianteActivo(null)}
                  className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={guardarNotas}
                  className="rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
