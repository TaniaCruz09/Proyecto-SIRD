"use client";

import { getEtnias } from '@/actions/catalogos/etniaMethods';
import NavbarAdmin from '@/components/navbarAdmin'
import SearchBar from '@/components/SearchBar';
import { Etnia } from '@/interfaces';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function Page() {
  const [etnias, setEtnias] = useState<Etnia[]>([])
    const [searchTerm, setSearchTerm] = useState<string>("");
  
    const router = useRouter();
  
    const fetchEtnia = async ()=> {
      try{
        const response = await getEtnias();
        setEtnias(response)
      } catch (error: any){
        if (error.message === "Unauthorized") {
          router.push("/auth/login"); // redirigir en cliente
        } else {
          console.error(error);
        }
      }
    }
  
    useEffect(()=>{
      fetchEtnia();
    }, []);

    //filtro
  const filteredEtnia = etnias.filter((u) =>
    u.etnia.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      <div>
        <NavbarAdmin/>
      </div>
      <div className="w-screen p-6 bg-gray-100">
        <div  className="flex items-center justify-between">
          <h1 className="ml-10 text-2xl font-bold mb-4 tracking-tight text-gray-600 text-center">Etnias</h1>
          <div className="flex justify-end mr-10 mb-6 mt-5">
            --
          </div>
        </div>
        <div className="flex items-center justify-between bg-white border rounded-t-xl">
          <h2 className="pl-10 text-xl font-bold text-gray-600">Listado de Etnias</h2>
          <SearchBar
                      value={searchTerm}
                      onChange={setSearchTerm}
                      onClear={() => setSearchTerm("")}
                      placeholder="Buscar Etnia"
                    />
        </div>
        --
      </div>
    </div>
  )
}
