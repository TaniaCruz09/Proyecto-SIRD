// import { Injectable } from "@nestjs/common";
// import { InjectRepository } from "@nestjs/typeorm";
// import { OrganizacionEscolarConAsignaturas } from "../entities/organizacionEscolarAsignaturas.entity";
// import { In, Repository } from "typeorm";
// import { OrganizacionEscolarConAsignaturaDto } from "../dtos/organizacionEscolarAsignatura.dto";
// import { Utilities } from "src/common/helpers/utilities";
// import { Asignatura } from "src/module/catalogos";



// @Injectable()
// export class OrganizacionEscolarConAsignaturaService {
//     constructor(
//         @InjectRepository(OrganizacionEscolarConAsignaturas)
//         private readonly organizacionEscolarAsignaturasRepository: Repository<OrganizacionEscolarConAsignaturas>,

//         @InjectRepository(Asignatura)
//         private readonly asignaturaRepository: Repository<Asignatura>,
//     ) { }

//     async createOrganizacionEscolarConAsignatura(dto: OrganizacionEscolarConAsignaturaDto) {
//         try {
//             // Buscar las asignaturas reales
//             const asignaturas = await this.asignaturaRepository.findBy({
//                 id: In(dto.asignaturaConDocente.map(ad => ad.asignaturaId)),
//             });

//             // Crear entidad con relaciones
//             const nuevo = this.organizacionEscolarAsignaturasRepository.create({
//                 grupo: dto.grupo,
//                 asignaturas, // ✅ ahora sí son entidades de verdad
//                 user_create_id: dto.user_create_id,
//             });

//             return await this.organizacionEscolarAsignaturasRepository.save(nuevo);
//         } catch (error) {
//             Utilities.catchError(error);
//         }
//     }



//     async getOrganizacionEscolarConAsignatura(): Promise<OrganizacionEscolarConAsignaturas[]> {
//         try {
//             const organizacionEscolarConAsignaturas = await this.organizacionEscolarAsignaturasRepository.find({
//                 relations: ['grupo', 'grupo.organizacionEscolar', 'grupo.grado','grupo.seccion','grupo.turno','grupo.docenteGuia','asignaturas'],
//             });
//             return organizacionEscolarConAsignaturas;
//         } catch (error) {
//             Utilities.catchError(error);
//         }
//     }

//     async getOrganizacionEscolarConAsignaturaById(id: number): Promise<OrganizacionEscolarConAsignaturas> {
//         try {
//             const organizacionEscolarConAsignatura = await this.organizacionEscolarAsignaturasRepository.findOne({
//                 where: { id },
//                 relations: ['grupo', 'grupo.organizacionEscolar', 'grupo.grado','grupo.seccion','grupo.turno','grupo.docenteGuia','asignaturas'],
//             });
//             if (!organizacionEscolarConAsignatura) {
//                 throw new Error('Organización escolar con asignatura no encontrada');
//             }
//             return organizacionEscolarConAsignatura;
//         } catch (error) {
//             Utilities.catchError(error);
//         }
//     }
//     async updateOrganizacionEscolarConAsignatura(id: number, dto: OrganizacionEscolarConAsignaturaDto): Promise<OrganizacionEscolarConAsignaturas> {
//         try {
//             const organizacionEscolarConAsignatura = await this.organizacionEscolarAsignaturasRepository.findOne({
//                 where: { id },
//                relations: ['grupo', 'grupo.organizacionEscolar', 'grupo.grado','grupo.seccion','grupo.turno','grupo.docenteGuia','asignaturas'],
//             });

//             if (!organizacionEscolarConAsignatura) {
//                 throw new Error('Organización escolar con asignatura no encontrada');
//             }

//             // Buscar asignaturas reales
//             const asignaturas = await this.asignaturaRepository.findBy({
//                 id: In(dto.asignaturaConDocente),
//             });

//             organizacionEscolarConAsignatura.grupo = dto.grupo;
//             organizacionEscolarConAsignatura.asignaturas = asignaturas;
//             organizacionEscolarConAsignatura.user_update_id = dto.user_update_id;
//             organizacionEscolarConAsignatura.update_at = new Date();

//             return await this.organizacionEscolarAsignaturasRepository.save(organizacionEscolarConAsignatura);
//         } catch (error) {
//             Utilities.catchError(error);
//         }
//     }

//     async deleteOrganizacionEscolarConAsignatura(id: number, userId: number): Promise<OrganizacionEscolarConAsignaturas> {
//         try {
//             const organizacionEscolarConAsignatura = await this.organizacionEscolarAsignaturasRepository.findOne({
//                 where: { id },
//                 relations: ['grupo', 'grupo.organizacionEscolar', 'grupo.grado','grupo.seccion','grupo.turno','grupo.docenteGuia','asignaturas'],
//             });
//             if (!organizacionEscolarConAsignatura) {
//                 throw new Error('Organización escolar con asignatura no encontrada');
//             }
//             // Asignar la fecha de eliminación y el usuario que elimina
//             organizacionEscolarConAsignatura.deleted_at = new Date();
//             organizacionEscolarConAsignatura.deleted_at_id = userId;
//             return await this.organizacionEscolarAsignaturasRepository.save(organizacionEscolarConAsignatura);
//         } catch (error) {
//             Utilities.catchError(error);
//         }
//     }
// }