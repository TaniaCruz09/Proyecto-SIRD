"use client";

import { feching } from "@/utils/cliente-http";

interface LoginData {
  email: string;
  password: string;
}

export async function saveLogin({ email, password }: LoginData) {
  const data = { email, password }
  const endPoint = `/auth/login`;

  const response = await feching(endPoint, "no-cache", "POST", data);

  return await response;
}