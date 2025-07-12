'use client'

import NavbarAdmin from "@/components/navbarAdmin";
import React, { useState } from "react";

type Estudiante = {
  id: number;
  nombre: string;
  notaMatematicas?: number;
  notaCiencias?: number;
};

type SeccionDocente = {
  id: number;
  nombre: string; // Ej: "6° A"
  estudiantes: Estudiante[];
};

type MateriaDocente = {
  id: number;
  nombre: string;
  secciones: SeccionDocente[];
};

// Datos simulados

const materiasDocente: MateriaDocente[] = [
  {
    id: 1,
    nombre: "Matemáticas",
    secciones: [
      {
        id: 101,
        nombre: "6° A",
        estudiantes: [
          { id: 1, nombre: "Ana López", notaMatematicas: 85 },
          { id: 2, nombre: "Carlos Martínez", notaMatematicas: 78 },
        ],
      },
      {
        id: 102,
        nombre: "7° B",
        estudiantes: [
          { id: 3, nombre: "Luisa Torres", notaMatematicas: 95 },
          { id: 4, nombre: "Pedro Gómez" },
        ],
      },
    ],
  },
  {
    id: 2,
    nombre: "Ciencias",
    secciones: [
      {
        id: 201,
        nombre: "6° A",
        estudiantes: [
          { id: 1, nombre: "Ana López", notaCiencias: 90 },
          { id: 2, nombre: "Carlos Martínez", notaCiencias: 80 },
        ],
      },
    ],
  },
];

export default function VistaDocente() {
  const [materiaSeleccionada, setMateriaSeleccionada] = useState<MateriaDocente>(
    materiasDocente[0]
  );
  const [seccionSeleccionada, setSeccionSeleccionada] = useState<SeccionDocente>(
    materiasDocente[0].secciones[0]
  );

  const [estudianteActivo, setEstudianteActivo] = useState<Estudiante | null>(null);
  const [notaEdit, setNotaEdit] = useState<number | "">("");

  // Cambiar sección al cambiar materia
  const onChangeMateria = (id: number) => {
    const materia = materiasDocente.find((m) => m.id === id);
    if (materia) {
      setMateriaSeleccionada(materia);
      setSeccionSeleccionada(materia.secciones[0]);
      setEstudianteActivo(null);
      setNotaEdit("");
    }
  };

  // Cambiar sección
  const onChangeSeccion = (id: number) => {
    const seccion = materiaSeleccionada.secciones.find((s) => s.id === id);
    if (seccion) {
      setSeccionSeleccionada(seccion);
      setEstudianteActivo(null);
      setNotaEdit("");
    }
  };

  const abrirModal = (est: Estudiante) => {
    setEstudianteActivo(est);
    const nota = materiaSeleccionada.nombre === "Matemáticas" ? est.notaMatematicas : est.notaCiencias;
    setNotaEdit(nota ?? "");
  };

  const guardarNota = () => {
    if (!estudianteActivo) return;
    // Aquí normalmente harías un POST o PUT al backend para guardar la nota.
    // Por simplicidad, vamos a simular guardado en estado (no persistente)

    // Actualizamos estado local
    seccionSeleccionada.estudiantes = seccionSeleccionada.estudiantes.map((est) =>
      est.id === estudianteActivo.id
        ? {
            ...est,
            ...(materiaSeleccionada.nombre === "Matemáticas"
              ? { notaMatematicas: Number(notaEdit) }
              : { notaCiencias: Number(notaEdit) }),
          }
        : est
    );
    setEstudianteActivo(null);
  };

  return (
    <div className="flex h-screen">
        <div>
            <NavbarAdmin/>
        </div>
    <div className="w-screen p-6 bg-gray-100 mx-auto min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Panel docente</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Selector materia */}
        <div className="flex-1">
          <label className="block mb-2 font-semibold">Materia que impartes</label>
          <select
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={materiaSeleccionada.id}
            onChange={(e) => onChangeMateria(Number(e.target.value))}
          >
            {materiasDocente.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Selector sección */}
        <div className="flex-1">
          <label className="block mb-2 font-semibold">Sección</label>
          <select
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={seccionSeleccionada.id}
            onChange={(e) => onChangeSeccion(Number(e.target.value))}
          >
            {materiaSeleccionada.secciones.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla estudiantes */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-6 py-3 text-center">#</th>
              <th className="px-6 py-3 text-left">Estudiante</th>
              <th className="px-6 py-3 text-center">{materiaSeleccionada.nombre}</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {seccionSeleccionada.estudiantes.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No hay estudiantes
                </td>
              </tr>
            )}

            {seccionSeleccionada.estudiantes.map((est, idx) => {
              const nota =
                materiaSeleccionada.nombre === "Matemáticas"
                  ? est.notaMatematicas
                  : est.notaCiencias;
              return (
                <tr key={est.id} className="hover:bg-indigo-50 cursor-pointer">
                  <td className="px-6 py-3 text-center">{idx + 1}</td>
                  <td className="px-6 py-3">{est.nombre}</td>
                  <td className="px-6 py-3 text-center">{nota ?? "-"}</td>
                  <td className="px-6 py-3 text-center">
                    <button
                      onClick={() => abrirModal(est)}
                      className="inline-block rounded bg-indigo-600 px-3 py-1 text-white text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    >
                      Editar nota
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal para editar nota */}
      {estudianteActivo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg relative">
            <button
              onClick={() => setEstudianteActivo(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
              aria-label="Cerrar modal"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">
              Editar nota: {estudianteActivo.nombre}
            </h2>

            <label className="block mb-2 font-semibold">{materiaSeleccionada.nombre}</label>
            <input
              type="number"
              min={0}
              max={100}
              value={notaEdit}
              onChange={(e) =>
                setNotaEdit(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="flex justify-end mt-6 gap-4">
              <button
                onClick={() => setEstudianteActivo(null)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={guardarNota}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
