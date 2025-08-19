"use client"
import { getRegisterEstudent } from "@/actions/resgisterEstudentMethods/regiterEstudentMethods";
import AddStudentModal from "@/components/modals/Estudiantes/AddStudentModal";
import SearchBar from "@/components/SearchBar";
import RegisterEstudentTable from "@/components/tables/RegisterEstudentTable";
import RegisterEstudent from "@/interfaces/registerEstudentInterface";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegistroEstudiantes() {
    const [showModal, setShowModal] = useState<boolean>(false)
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [student, setStudent] = useState<RegisterEstudent[]>([])

    const router = useRouter()
    const fetchEstudiantes = async () => {
        try {
            const res = await getRegisterEstudent()
            setStudent(res || [])
            console.log(res, ' este es el resultado de la funcion fetch')

        } catch (error: any) {
            if (error.message === "Unauthorized") {
                router.push("/auth/login"); // redirigir en cliente
            } else {
                console.error(error);
            }
        }
    }

    useEffect(() => {
        fetchEstudiantes()
    }, [])
    //filtro que busca por el nombre
    const filteredStudent = student.filter((u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <div className="mx-6">
            <div className="flex items-center justify-between">
                <h1 className="ml-10 text-2xl font-bold mb-4 tracking-tight text-gray-600 text-center">
                    Estudiante
                </h1>
                <div className="flex justify-end mr-10 mb-6 mt-5">
                    <AddStudentModal fetchStudent={fetchEstudiantes} />
                </div>
            </div>
            <div className="flex items-center justify-between bg-white border rounded-t-xl">
                <h2 className="pl-10 text-xl font-bold text-gray-600">
                    Listado de estudiante
                </h2>
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    onClear={() => setSearchTerm("")}
                    placeholder="Buscar estudiante"
                />
            </div>
            <RegisterEstudentTable
                student={filteredStudent}
                fetchStudent={fetchEstudiantes}
            />
        </div>
    )
}