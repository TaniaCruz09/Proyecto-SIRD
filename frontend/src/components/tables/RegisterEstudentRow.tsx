'use client'
import RegisterEstudent from "@/interfaces/registerEstudentInterface"
import { TbEyePlus } from "react-icons/tb"

interface StudentRowProps{
    student: RegisterEstudent,
    fetchStudent: () => Promise<void>
}

export default function RegisterEstudentRow({student, fetchStudent}: StudentRowProps){
   return(
    <tr className="hover:bg-gray-100">
        <td className="p-3 border-b border-gray-200">{student.id}</td>
        <td className="p-3 border-b border-gray-200">{student.name}</td>
        <td className="p-3 border-b border-gray-200">{student.lastName}</td>
        <td className="p-3 border-b border-gray-200 text-center"><button><TbEyePlus/></button></td>
        <td className="p-3 px-2 py-2 border-b border-gray-200 text-center">editar</td>
        <td className="p-3 px-2 py-2 border-b border-gray-200 text-center">eliminar</td>
    </tr>
   )
}