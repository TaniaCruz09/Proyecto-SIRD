"use client"

import RegisterEstudent from "@/interfaces/registerEstudentInterface"
import RegisterEstudentRow from "./RegisterEstudentRow"
import { useState } from "react"
interface StudentProps {
  student: RegisterEstudent[]
  fetchStudent: () => Promise<void>
}
export default function RegisterEstudentTable({ student, fetchStudent }: StudentProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const EstudentsPerPage = 5
  const indexOfLastStudent = currentPage * EstudentsPerPage
  const indexOfFirstStudent = indexOfLastStudent - EstudentsPerPage
  const currentStudents = student.slice(indexOfFirstStudent, indexOfLastStudent)
  return (
    <div className="bg-white">
      <div className="bg-white shadow-lg h-[calc(100vh-230px)] overflow-y-auto">
        <table className="w-full space-y-2 text-left bg-white text-gray-800">
          <thead className="bg-gray-200 uppercase text-xs font-semibold sticky top-0 z-10">
            <tr>
              <th className="p-3 border-b border-gray-300">Id</th>
              <th className="p-3 border-b border-gray-300">Foto de perfil</th>
              <th className="p-3 border-b border-gray-300">Nombres</th>
              <th className="p-3 border-b border-gray-300">Apellidos</th>
              <th className="p-3 border-b border-gray-300">Codigo del estudiante</th>
              <th className="p-1 border-b border-gray-300 text-center">Ver Expediente</th>
              <th className="p-1 border-b border-gray-300 text-center">Editar</th>
              <th className="p-1 border-b border-gray-300 text-center">Eliminar</th>
            </tr>
          </thead>
          <tbody className="text-black text-sm">
            {student.length > 0 ? (
              currentStudents.map((student) => (
                <RegisterEstudentRow
                  key={student.id}
                  fetchStudent={fetchStudent}
                  student={student}
                />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-3">
                  No hay docentes registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-between items-center px-6 py-4 text-sm text-gray-600">
        <p>
          Página {currentPage} de {Math.ceil(student.length / EstudentsPerPage)}
        </p>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                prev < Math.ceil(student.length / EstudentsPerPage) ? prev + 1 : prev
              )
            }
            disabled={currentPage === Math.ceil(student.length / EstudentsPerPage)}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  )
}