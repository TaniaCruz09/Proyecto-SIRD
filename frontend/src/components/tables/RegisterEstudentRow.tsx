'use client'
import RegisterEstudent from "@/interfaces/registerEstudentInterface"
import { TbEyePlus } from "react-icons/tb"
import EditStudentModal from "../modals/Estudiantes/EditStudentModal";
import DeleteStudentModal from "../modals/Estudiantes/DeleteStudentModal";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";

interface StudentRowProps {
    student: RegisterEstudent,
    fetchStudent: () => Promise<void>
}

export default function RegisterEstudentRow({ student, fetchStudent }: StudentRowProps) {

    const getImageUrl = (path?: string) => {
        if (!path) return null;
        return `${process.env.NEXT_PUBLIC_API_UPLOADS}${path}`;
    };

    return (
        <tr className="hover:bg-gray-100">
            <td className="p-3 border-b border-gray-200">{student.id}</td>
            <td className="p-3 border-b border-gray-200 cursor-pointer">
                <Avatar className="w-10 h-10 border-2 border-green-200">
                    {student.profileImage ? (
                        <AvatarImage
                            src={getImageUrl(student.profileImage) || "/placeholder.svg"}
                            alt={student.name}
                        />
                    ) : (
                        <AvatarFallback className="text-md font-bold bg-green-100 text-green-700">
                            {`${student.name.split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .slice(0, 1)}${student.lastName.split("")
                                    .map((n: string) => n[0])
                                    .join("")
                                    .slice(0, 1)}`}
                        </AvatarFallback>
                    )}
                </Avatar>
            </td>
            <td className="p-3 border-b border-gray-200">{student.name}</td>
            <td className="p-3 border-b border-gray-200">{student.lastName}</td>
            <td className="p-3 border-b border-gray-200">{student.studentCode}</td>
            <td className="p-3 border-b border-gray-200 text-center">
                <Link
                    href={`/historial-estudiante/${student.id}`}
                    className="inline-flex items-center justify-center bg-blue-300/30 hover:bg-blue-400 text-blue-600 font-bold text-xl px-4 py-2 rounded-md cursor-pointer transition"
                >
                    <TbEyePlus />
                </Link>
            </td>
            <td className="p-3 px-2 py-2 border-b border-gray-200 text-center">
                <EditStudentModal student={student} fetchStudent={fetchStudent} />
            </td>
            <td className="p-3 px-2 py-3 border-b border-gray-200 text-center">
                <DeleteStudentModal idEliminar={student.id!} fetchStudent={fetchStudent} />
            </td>
        </tr>
    )
}
