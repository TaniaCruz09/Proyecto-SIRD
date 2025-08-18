"use client"
import { getOrganizacionLaboral } from "@/actions/organizacionLaboralMetodo/organizacionLaboralMetodo";
import AddOrganizacionLaboralModal from "@/components/modals/organizacionLaboral/AddOrganizacionLaboral";
import NavbarAdmin from "@/components/navbarAdmin";
import SearchBar from "@/components/SearchBar";
import OrganizacionLaboralTable from "@/components/tables/organizacionLaboral/organizacionLaboralTable";
import { OrganizacionLaboral } from "@/interfaces/organizacionLaboralInterface";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegistroEstudiantes() {
    const [showModal, setShowModal] = useState<boolean>(false)
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [organizacionLaboral, setOrganizacionLaboral] = useState<OrganizacionLaboral[]>([])

    const router = useRouter()
    const fetchOrganizacionLaboral = async () => {
        try {
            const res = await getOrganizacionLaboral()
            setOrganizacionLaboral(res || [])
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
        fetchOrganizacionLaboral()
    }, [])
    //filtro que busca por el nombre
        const filteredStudent = organizacionLaboral.filter((u) =>
            u.id!.toString().includes(searchTerm) ||
            u.docente.nombres.toLowerCase().includes(searchTerm.toLowerCase()) || ""
            
        );
    return (
        <div className="flex h-screen ">
            <div>
                <NavbarAdmin />
            </div>
            <div className="w-screen p-6 bg-gray-100">
                <div className="flex items-center justify-between">
                    <h1 className="ml-10 text-2xl font-bold mb-4 tracking-tight text-gray-600 text-center">
                        Organizacion Laboral
                    </h1>
                    <div className="flex justify-end mr-10 mb-6 mt-5">
                        <AddOrganizacionLaboralModal fetchOrganizacionLaboral={fetchOrganizacionLaboral} />
                    </div>
                </div>
                <div className="flex items-center justify-between bg-white border rounded-t-xl">
                    <h2 className="pl-10 text-xl font-bold text-gray-600">
                        Listado de organizacion laboral
                    </h2>
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        onClear={() => setSearchTerm("")}
                        placeholder="Buscar Organizacion Laboral"
                    />
                </div>
                <OrganizacionLaboralTable
                    organizacionLaboral={filteredStudent}
                    fetchOrganizacionLaboral={fetchOrganizacionLaboral}
                />
            </div>
        </div>
    )
}