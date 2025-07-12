"use client";

import { getProfesiones } from '@/actions/catalogos/profesionMethods';
import NavbarAdmin from '@/components/navbarAdmin'
import { Profesion } from '@/interfaces';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function Page() {
  const [profesiones, setProfesiones] = useState<Profesion[]>([])
    const [searchTerm, setSearchTerm] = useState<string>("");
  
    const router = useRouter();
  
    const fetchProfesiones = async ()=> {
      try{
        const response = await getProfesiones();
        setProfesiones(response)
      } catch (error: any){
        if (error.message === "Unauthorized") {
          router.push("/auth/login"); // redirigir en cliente
        } else {
          console.error(error);
        }
      }
    }
  
    useEffect(()=>{
      fetchProfesiones();
    }, []);

    //filtro
  const filteredProfesion = profesiones.filter((u) =>
    u.profession.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      <div>
        <NavbarAdmin/>
      </div>
      <div className="w-screen p-6 bg-gray-100">
        <div  className="flex items-center justify-between">
          <h1 className="ml-10 text-2xl font-bold mb-4 tracking-tight text-gray-600 text-center">Profesiones</h1>
          <div className="flex justify-end mr-10 mb-6 mt-5">
            --
          </div>
        </div>
        <div className="flex items-center justify-between bg-white border rounded-t-xl">
          <h2 className="pl-10 text-xl font-bold text-gray-600">Listado de Profesiones</h2>
          --
        </div>
        --
      </div>
    </div>
  )
}
