"use client"

import RegisterEstudentRow from "./RegisterEstudentRow"

export default function RegisterEstudentTable(){
   return(
    <div className="bg-white shadow-md max-screen overflow-hidden shadow-md">
        <table className="w-full h-full overflow-y-auto space-y-2 text-left bg-white overflow-y-auto text-gray-800">
            <thead className="bg-gray-200 uppercase text-sm font-semibold sticky top-0 z-10">
            <tr>
                <th className="p-3 border-b border-gray-300">Id</th>
                <th className="p-3 border-b border-gray-300">Estudiante</th>
                <th  className="p-1 border-b border-gray-300 text-center">Editar</th>
                <th className="p-1 border-b border-gray-300 text-center">Eliminar</th>
            </tr>
            </thead>
            <tbody className="text-black text-sm">
                <RegisterEstudentRow/>
            </tbody>
        </table>
    </div>
   )
}