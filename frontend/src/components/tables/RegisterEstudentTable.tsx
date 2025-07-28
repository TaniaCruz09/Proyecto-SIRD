"use client"

import RegisterEstudent from "@/interfaces/registerEstudentInterface"
import RegisterEstudentRow from "./RegisterEstudentRow"
interface StudentProps{
    student : RegisterEstudent[]
    fetchStudent: () => Promise<void>
}
export default function RegisterEstudentTable({student, fetchStudent }: StudentProps){

   return(
    <div className="bg-white shadow-md max-screen overflow-hidden shadow-md">
        <table className="w-full h-full overflow-y-auto space-y-2 text-left bg-white overflow-y-auto text-gray-800">
            <thead className="bg-gray-200 uppercase text-sm font-semibold sticky top-0 z-10">
            <tr>
                <th className="p-3 border-b border-gray-300">Id</th>
                <th className="p-3 border-b border-gray-300">Nombres</th>
                <th className="p-3 border-b border-gray-300">apellido 1</th>
                <th className="p-3 border-b border-gray-300">codigo estudiante</th>
                <th className="p-3 border-b border-gray-300 text-center">Ver detalles</th>
                <th  className="p-1 border-b border-gray-300 text-center">Editar</th>
                <th className="p-1 border-b border-gray-300 text-center">Eliminar</th>
            </tr>
            </thead>
            <tbody className="text-black text-sm">
                {student.map(
                    (student)=> (<RegisterEstudentRow key={student.id} student={student} fetchStudent={fetchStudent}/>) 
                )}
            </tbody>
        </table>
        <ModalDetalleEstudiante student={student} fetchStudent={fetchStudent}/>
    </div>
   )
}