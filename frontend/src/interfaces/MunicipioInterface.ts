import { Departamento } from "./DepartamentoInterface";


export interface Municipio {
  id: number;
  municipio: string;
  departamento: Departamento;
}
