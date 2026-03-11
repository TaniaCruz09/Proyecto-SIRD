"use client"
import { getRegisterEstudent } from "@/actions/resgisterEstudentMethods/regiterEstudentMethods";
import AddStudentModal from "@/components/modals/Estudiantes/AddStudentModal";
import SearchBar from "@/components/SearchBar";
import RegisterEstudentTable from "@/components/tables/RegisterEstudentTable";
import RegisterEstudent from "@/interfaces/registerEstudentInterface";
import { useEffect, useState } from "react";

export default function RegistroEstudiantes() {
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [student, setStudent] = useState<RegisterEstudent[]>([])

    const fetchEstudiantes = async () => {
        try {
            const res = await getRegisterEstudent()
            const ordered = (res || []).slice().sort((a: RegisterEstudent, b: RegisterEstudent) => {
                const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                if (dateA && dateB && dateA !== dateB) return dateA - dateB;
                return (a.id ?? 0) - (b.id ?? 0);
            });
            setStudent(ordered)
        } catch (error: unknown) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchEstudiantes()
    }, [])

    // Filtro por nombre o codigo de estudiante
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const filteredStudent = student.filter((u) => {
        if (!normalizedSearch) return true;

        const fullName = `${u.name ?? ""} ${u.lastName ?? ""}`.toLowerCase();
        const code = String(u.studentCode ?? "").toLowerCase();

        return fullName.includes(normalizedSearch) || code.includes(normalizedSearch);
    });
    return (
        <div className="mx-6">
            <div className="flex items-center justify-between">
                <h1 className="ml-10 text-2xl font-bold mb-4 tracking-tight text-gray-600 text-center">
                    Estudiantes
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
                    placeholder="Buscar por nombre o codigo de estudiante"
                />
            </div>
            <RegisterEstudentTable
                student={filteredStudent}
                fetchStudent={fetchEstudiantes}
            />
        </div>
    )
}