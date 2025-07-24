"use server";


import Role from "@/interfaces/authInterface";
import { feching } from "@/utils/cliente-http";

export async function getRoles(): Promise<Role[]>  {
  const endPoint = `/roles`;

  const response = await feching(endPoint, "no-cache", "GET");

  if (!response.data || response.error) {
    throw new Error(response?.error || "Error al obtener roles");
  }

  return response.data;
}

export async function getRolesById(id: number) {
  const endPoint = `/roles/${id}`

  const response = await feching(endPoint, "no-cache", "GET")

  if(!response.data || response.error){
    throw new Error(response?.error)
  }
  return response.data
}

export async function saveRoles(rol: string) {
  const data = {rol};
  const endPoint= `/roles`;

  const response = await feching(endPoint, "no-cache", "POST", data)

  if(!response || response.error){
        throw new Error(response?.error)
    }

    return response.data;
}

export async function updateRoles(id:number, rol: string) {
  const data = {rol};
  const endPoint = `/roles/${id}`

  const response = await feching(endPoint, "no-cache", "PUT", data);

  if(!response.data || response.data.error){
    throw new Error(response?.error)
  }

  return response.data
}

export async function deleteRoles(id:number) {
  const endPoint = `/roles/${id}`;

  const response = await feching(endPoint, "no-cache", "DELETE")

  if(!response.data || response.data.error){
    throw new Error(response?.error)
  }

  return response.data
}