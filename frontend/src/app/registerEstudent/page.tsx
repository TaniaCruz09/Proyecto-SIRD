"use client"
import BtnOpenAddModal from "@/components/Buttons/btnOpenAddModal";
import ModalBase from "@/components/modals/ModalBase";
import NavbarAdmin from "@/components/navbarAdmin";
import SearchBar from "@/components/SearchBar";
import RegisterEstudentRow from "@/components/tables/RegisterEstudentRow";
import RegisterEstudentTable from "@/components/tables/RegisterEstudentTable";
import RolTable from "@/components/tables/RolTable";
import { useState } from "react";

export default function RegistroEstudiantes(){
const [showModal, setShowModal] = useState<boolean>(false)
const [searchTerm, setSearchTerm]= useState<string>("")

 const fetchEstudiantes = async ()=>{
    try {
        const res = await 
    } catch (error) {
        
    }
 }
    return(
        <div className="flex h-screen bg-white">
            <div>
                <NavbarAdmin/>
            </div>
            <div className='w-screen p-6 bg-gray-100'>
                <div className="p-6 flex item-center justify-between">
                    <h1 className="ml-10 text-2xl font-bold c mb-4 tracking-tight text-gray-600 text-center">Estudiantes</h1>
                <div className="flex justify-end mr-10 mb-5 bg-red" >
                    <BtnOpenAddModal onClick={()=> setShowModal(true)}/>
                    {showModal && (
                        <ModalBase 
                        onshowModal={showModal}
                        onCloseModal={()=> setShowModal(false)}
                        />
                    )}
                </div>
                </div>
                <div className="flex items-center justify-between bg-white border rounded-t-xl">
                    <h2 className='pl-10 text-xl font-bold text-gray-600'>Listado de estudiantes</h2>
                    <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    onClear={()=> setSearchTerm("")}
                    placeholder="Buscar estudiante"
                    />
                </div>
                <RegisterEstudentTable
                
                />
            </div>
        </div>
    )
}