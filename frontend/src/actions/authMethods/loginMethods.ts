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
  return await response;
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

  // -----------------------------------------------------------------------------
// 🔹 Recuperar contraseña - NUEVAS FUNCIONES
// -----------------------------------------------------------------------------

// Enviar código de recuperación
export async function requestPasswordReset(email: string) {
  const endPoint = `/auth/request-reset`;
  return await feching(endPoint, "no-cache", "POST", { email });
}

// Verificar código recibido por correo
export async function verifyResetCode(email: string, code: string) {
  const endPoint = `/auth/verify-code`;
  return await feching(endPoint, "no-cache", "POST", { email, code });
}

// Restablecer contraseña con el token
export async function resetPassword(token: string, newPassword: string) {
  const endPoint = `/auth/reset-password`;
  return await feching(endPoint, "no-cache", "POST", { token, newPassword });
}