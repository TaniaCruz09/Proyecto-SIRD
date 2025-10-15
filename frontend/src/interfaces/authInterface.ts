import { Docente } from "./DocenteInterface";

export interface Role {
  id: number;
  rol: string;
  isActive: boolean;
  deleteAt?: Date | null;
}

export interface User {
  id: number;
  docente: Docente | null,
  name: string;
  email: string;
  roles?: Role[],
  resetCode?: string;
  resetCodeExpire?: Date;
  code: string;
}
