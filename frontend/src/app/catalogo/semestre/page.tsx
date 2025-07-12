"use client";

import { getSemestres } from '@/actions/catalogos/semestreMethods';
import AddSemestreModal from '@/components/modals/catalogo/semestreModals/AddSemestreModal';
import NavbarAdmin from '@/components/navbarAdmin'
import SearchBar from '@/components/SearchBar';
import SemestreTable from '@/components/tables/catalogo/SemestreTable';
import { Semestre } from '@/interfaces';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function Page() {
  const [semestres, setSemestres] = useState<Semestre[]>([])
    const [searchTerm, setSearchTerm] = useState<string>("");
  
    const router = useRouter();
  
    const fetchSemestres = async ()=> {
      try{
        const response = await getSemestres();
        setSemestres(response)
      } catch (error: any){
        if (error.message === "Unauthorized") {
          router.push("/auth/login"); // redirigir en cliente
        } else {
          console.error(error);
        }
      }
    }
  
    useEffect(()=>{
      fetchSemestres();
    }, []);

    //filtro
  const filteredSemestres = semestres.filter((u) =>
    u.semestre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      <div>
        <NavbarAdmin/>
      </div>
      <div className="w-screen p-6 bg-gray-100">
        <div  className="flex items-center justify-between">
          <h1 className="ml-10 text-2xl font-bold mb-4 tracking-tight text-gray-600 text-center">Semestres</h1>
          <div className="flex justify-end mr-10 mb-6 mt-5">
            <AddSemestreModal fetchSemestres={fetchSemestres}/>
          </div>
        </div>
        <div className="flex items-center justify-between bg-white border rounded-t-xl">
          <h2 className="pl-10 text-xl font-bold text-gray-600">Listados de Semestres</h2>
          <SearchBar
                      value={searchTerm}
                      onChange={setSearchTerm}
                      onClear={() => setSearchTerm("")}
                      placeholder="Buscar docente"
                    />
        </div>
        <SemestreTable semestre={filteredSemestres} fetchSemestres={fetchSemestres}/>
      </div>
    </div>
  )
}
