"use client";

import { getMunicipios } from '@/actions/catalogos/municipioMethods';
import NavbarAdmin from '@/components/navbarAdmin'
import { Municipio } from '@/interfaces';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function Page() {
  const [municipios, setMunicipios] = useState<Municipio[]>([])
    const [searchTerm, setSearchTerm] = useState<string>("");
  
    const router = useRouter();
  
    const fetchMunicipios = async ()=> {
      try{
        const response = await getMunicipios();
        setMunicipios(response)
      } catch (error: any){
        if (error.message === "Unauthorized") {
          router.push("/auth/login"); // redirigir en cliente
        } else {
          console.error(error);
        }
      }
    }
  
    useEffect(()=>{
      fetchMunicipios();
    }, []);

    //filtro
  const filteredMunicipio = municipios.filter((u) =>
    u.municipio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      <div>
        <NavbarAdmin/>
      </div>
      <div className="w-screen p-6 bg-gray-100">
        <div  className="flex items-center justify-between">
          <h1 className="ml-10 text-2xl font-bold mb-4 tracking-tight text-gray-600 text-center">Municipios</h1>
          <div className="flex justify-end mr-10 mb-6 mt-5">
            --
          </div>
        </div>
        <div className="flex items-center justify-between bg-white border rounded-t-xl">
          <h2 className="pl-10 text-xl font-bold text-gray-600">Listado de Municipios</h2>
          --
        </div>
        --
      </div>
    </div>
  )
}
