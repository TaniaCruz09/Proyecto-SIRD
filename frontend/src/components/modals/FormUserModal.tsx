"use cliente"
import { getRoles } from '@/actions/authMethods/rolesMethods';
import React, { useEffect, useState } from 'react'

interface ModalFormUserProps {
    visible: boolean;
    onCloseModal: ()=> void
    reset: ()=>void;
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    email: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    rol: string;
    setRol: React.Dispatch<React.SetStateAction<string>>;
    isEditMode: boolean;
    update?: (e: React.FormEvent)=> Promise<void>;
    create?: (e: React.FormEvent)=> Promise<void>;
}

export default function FormUserModal({visible, reset, name, setName, email, setEmail, password, setPassword, rol, setRol, isEditMode, update, create, onCloseModal}: ModalFormUserProps) {
    const [roles, setRoles] = useState<{id: number, rol:string}[]>()
    
    
    
    useEffect(()=>{
        const fetchRoles = async ()=>{
            try {
                const rolesData = await getRoles();
                setRoles(rolesData);
            } catch (error) {
                console.error("Error al cargar los roles:", error);
            }
        };
        
        fetchRoles();
    },[]);
    
    console.log(isEditMode)
    
    if(!visible) return null
    
  return (
         <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md relative">
                <button
                    onClick={()=> {onCloseModal(); reset()}}
                    className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
                >
                    X
                </button>
                <h2 className="text-xl font-semibold mb-4">{isEditMode ? "Editar Usuario" : "Formulario de Usuario"}</h2>
                <form className="space-y-4" onSubmit={isEditMode ? update : create}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nombre"
                        className="w-full p-3 border rounded-xl border-gray-300 text-black"
                        required
                    />
                    <input
                          type="email"
                          value={email}
                          onChange={(e)=> setEmail(e.target.value)}
                          placeholder="Correo"
                          className="w-full p-3 border rounded-xl border-gray-300 text-black"
                          required
                        />
                    <input
                          type="password"
                          value={password}
                          onChange={(e)=> setPassword(e.target.value)}
                          placeholder="Contraseña"
                          className="w-full p-3 border rounded-xl border-gray-300 text-black"
                          required
                        />
                    <select 
                        className="w-full p-3 border rounded-xl border-gray-300 text-black"
                        value={rol}
                        onChange={(e)=> setRol(e.target.value)}
                        >
                          <option value="">Selecciona un rol</option>
                          {roles?.map((r)=>(
                            <option key={r.id} value={r.id}>{r.rol}</option>
                          ))}
                    </select>
                    <button
                          type="submit"
                          className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600"
                        >
                          {isEditMode ? "Actualizar" : "Guardar"}
                    </button>
                </form>
            </div>
        </div>
    )
}