import { Municipio } from "./catalogoInterface/MunicipioInterface";


export interface CentroEscolar {
    id: number,
    nombreCentro: string,
    codigoEstablecimiento: string,
    codigoCentro: string,
    direccionCentro: string,
    municipio: Municipio
}
export interface CentroEscolarPayload {
    nombreCentro: string,
    codigoEstablecimiento: string,
    codigoCentro: string,
    direccionCentro: string,
    municipio: Municipio
}