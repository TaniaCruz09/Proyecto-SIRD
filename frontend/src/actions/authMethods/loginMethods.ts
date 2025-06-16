"use server";

import feching from "@/utils/cliente-http";

export async function saveLogin(request: FormData) {
    const data = {
        email: request.get("email"),
        password: request.get("password")
    }

    const endPoint = `/auth/login`;

    const login = await feching(endPoint, "no-cache", "POST", data);

    if(!login.data){
        throw new Error(login.error);
    }

    return await login.data;
}