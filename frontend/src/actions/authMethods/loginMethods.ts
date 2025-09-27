"use client";

import { feching } from "@/utils/cliente-http";

interface LoginData {
  email: string;
  password: string;
}

interface RolePayload {
  role: string;
}

export async function saveLogin(payload: LoginData) {
  const endPoint = `/auth/login`;

  const response = await feching(endPoint, "no-cache", "POST", payload);

  return await response.user;
}

export async function SelectRole(role: RolePayload) {
  try {

    const endPoint = `/auth/select-role`

    const response = await feching(endPoint, "no-cache", "POST", role)

    return response;
  } catch (error) {
    console.error("Error en selectRole:", error)
    throw error
  }
}

export async function logoutUser() {
  const endPoint = "/auth/logout"
  try {
    const response = await feching(endPoint, "no-cache", "POST")
    return response
  } catch (error) {
    console.error("Error en logoutUser:", error)
    throw error
  }
}

export async function getCurrentUser() {
  const endPoint = "/auth/me"
  try {
    const response = await feching(endPoint, "no-cache", "GET")
    return response
  } catch (error: any) {
    if (error?.response?.status !== 401) {
      console.error("Error en getCurrentUser:", error)
    }
    throw error
  }
}