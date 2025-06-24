
export default  interface Role {
  id: number;
  rol: string;
  isActive: boolean;
  deleteAt?: Date | null;
}

export default interface User {
  id: number;
  name: string;
  email: string;
  roles?: Role[]
}
