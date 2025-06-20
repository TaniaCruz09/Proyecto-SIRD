"use server";

import { feching } from "@/utils/cliente-http";


interface UserData{ 
    name: string,
    email: string,
    password: string,
}

export async function getUser(){
    const endPoint = `/users`;

    const response = await feching(endPoint, "no-cache", "GET");

    if(!response || response.error){
        throw new Error(response?.error || "error desconocido desde el front de obtener todos los usuario")
    }

    return response;
}

export async function getUserById(id: number) {
    const endPoint = `/users/${id}`;

    const response = await feching(endPoint, "no-cache", "GET");

    if(!response || response.error){
        throw new Error(response?.error || "error desconocido desde el front de obtener un usuario")
    }

    return response;
    
}
export async function saveUser({name, email, password}: UserData){
    const data = {name, email, password};
    const endPoint = `/users`;

    const response = await feching(endPoint, "no-cache", "POST", data)

    if(!response || response.error){
        throw new Error(response?.error || "error desconocido desde el front de agragar usuario")
    }

    return response;
}

//hice esta funcion ya que actualmente el sistema primero crea el usuario luego le asigna el rol
export async function assignRoleToUser(userId: number, roles: number[]) {
  const endPoint = `/asignar-roles/${userId}`;
  const response = await feching(endPoint, "no-cache", "POST", { userId, roles });

  if (!response || response.error) {
    throw new Error(response?.error || "Error al asignar rol al usuario");
  }

  return response;
}

export async function updateUser(id: number, {name, email, password}: UserData) {
    const data = {name, email, password};
    const endPoint = `/users/${id}`;

    const response = await feching(endPoint, "no-cache", "PUT", data);

     if(!response || response.error){
        throw new Error(response?.error || "error desconocido desde el front de actualizar usuario")
    }

    return response; 
}

export async function deleteUser(id:number) {
    const endPoint = `/users/${id}`;

    const response = await feching(endPoint, "no-cache", "DELETE");

    if(!response || response.error){
        throw new Error(response?.error || "error desconocido desde el front de eliminar usuario")
    }

    return response; 
}

