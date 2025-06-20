"use server";

import { feching } from "@/utils/cliente-http";

export async function getRoles() {
  const endPoint = `/roles`;

  const response = await feching(endPoint, "no-cache", "GET");

  if (!response.data || response.error) {
    throw new Error(response?.error || "Error al obtener roles");
  }

  return response.data;
}