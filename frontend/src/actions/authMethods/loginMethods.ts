"use server";

import { feching } from "@/utils/cliente-http";

interface LoginData {
  email: string;
  password: string;
}

export async function saveLogin({ email, password }: LoginData) {
    const data = { email, password }
    console.log('estos son los datos',email,password)
    const endPoint = `/auth/login`;
    
    const response = await feching(endPoint, "no-cache", "POST", data);

    // console.log("🔎 RESPUESTA DEL BACKEND:", response);
    // console.log("📤 ENVIANDO A BACKEND:", { email, password })
    // console.log("📥 RESPUESTA cruda DEL BACKEND:", response.data)
 

    if(!response || response.error){
        throw new Error(response?.error || "Error desconocido en el login");
    }

    return await response;
}