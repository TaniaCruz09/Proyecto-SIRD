import { Injectable, NotFoundException } from "@nestjs/common";
import { Utilities } from "src/common/helpers/utilities";
import { OrganizacionLaboralAsignaturaGrupo } from "./AsignaturaGrupo.entity";
import { GrupoAsignaturasDto, OrganizacionLaboralAsignaturaGrupoDto } from "./asignaturaGrupo.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AsignaturaGrupoService {
    constructor(
        @InjectRepository(OrganizacionLaboralAsignaturaGrupo)
        private readonly asignaturaGrupoRepository: Repository<OrganizacionLaboralAsignaturaGrupo>,
    ) { }



    async createAsiganturaGrupo(
        createDto: OrganizacionLaboralAsignaturaGrupoDto
    ): Promise<OrganizacionLaboralAsignaturaGrupo[]> {
        try {
            const result: OrganizacionLaboralAsignaturaGrupo[] = [];

            // Validación base
            if (
                !createDto.organizacionLaboralId ||
                !Array.isArray(createDto.grupos) ||
                createDto.grupos.length === 0
            ) {
                throw new Error('Datos incompletos: organización laboral o grupos no válidos.');
            }

            for (const grupoItem of createDto.grupos) {
                if (!grupoItem.grupoId || !Array.isArray(grupoItem.asignaturasIds)) {
                    continue; // salta este grupo si no tiene grupoId o asignaturas
                }

                for (const asignaturaId of grupoItem.asignaturasIds) {
                    if (!asignaturaId) continue; // salta si el id es null o 0

                    const nuevaRelacion = this.asignaturaGrupoRepository.create({
                        organizacionLaboral: { id: createDto.organizacionLaboralId },
                        grupo: { id: grupoItem.grupoId },
                        asignatura: { id: asignaturaId },
                        user_create_id: createDto.user_create_id,
                    });

                    const saved = await this.asignaturaGrupoRepository.save(nuevaRelacion);
                    result.push(saved);
                }
            }

            return result;
        } catch (error) {
            Utilities.catchError(error);
        }
    }



    async getAsignaturaGrupos(): Promise<OrganizacionLaboralAsignaturaGrupo[]> {
        try {
            const data = await this.asignaturaGrupoRepository.find({
                relations: ['grupo', 'grupo.grado', 'grupo.seccion', 'grupo.modalidad', 'grupo.turno', 'asignatura', 'organizacionLaboral'],
            });

            return data;
        } catch (error) {
            Utilities.catchError(error);
        }
    }


    async getAsignaturaGruposById(organizacionLaboralId: number): Promise<OrganizacionLaboralAsignaturaGrupo[]> {
        try {
            const relaciones = await this.asignaturaGrupoRepository.find({
                where: {
                    organizacionLaboral: { id: organizacionLaboralId },
                },
                relations: ['grupo', 'grupo.grado', 'grupo.seccion', 'grupo.modalidad', 'grupo.turno', 'asignatura', 'organizacionLaboral'],
            });

            if (!relaciones || relaciones.length === 0) {
                throw new NotFoundException(`No se encontraron asignaciones para la organización laboral con ID ${organizacionLaboralId}`);
            }

            return relaciones;
        } catch (error) {
            Utilities.catchError(error);
        }
    }


    async updateAsignaturasEnGrupos(id: number, dto: OrganizacionLaboralAsignaturaGrupoDto) {
        const { organizacionLaboralId, grupos } = dto;

        for (const grupo of grupos) {
            const { grupoId, asignaturasIds } = grupo;

            // 1. Traer las asignaciones actuales de este grupo
            const actuales = await this.asignaturaGrupoRepository.find({
                where: {
                    organizacionLaboral: { id: organizacionLaboralId },
                    grupo: { id: grupoId },
                },
                relations: ['asignatura'],
            });

            const actualesIds = actuales.map(a => a.asignatura.id);

            // 2. Detectar asignaturas nuevas que se deben agregar
            const nuevas = asignaturasIds.filter(id => !actualesIds.includes(id));

            // 3. Detectar asignaturas que ya no están y deben eliminarse
            const paraEliminar = actuales.filter(a => !asignaturasIds.includes(a.asignatura.id));

            // 4. Agregar nuevas relaciones
            for (const asignaturaId of nuevas) {
                const nuevaRelacion = this.asignaturaGrupoRepository.create({
                    organizacionLaboral: { id: organizacionLaboralId },
                    grupo: { id: grupoId },
                    asignatura: { id: asignaturaId },
                });
                await this.asignaturaGrupoRepository.save(nuevaRelacion);
            }

            // 5. Eliminar relaciones que ya no deben existir
            for (const eliminar of paraEliminar) {
                await this.asignaturaGrupoRepository.remove(eliminar);
            }
        }

        return { message: 'Actualización parcial exitosa' };
    }

    async deleteAsignaturaGrupo(id: number, userId: number): Promise<OrganizacionLaboralAsignaturaGrupo> {
        try {
            const AsignaturaGrupos = await this.asignaturaGrupoRepository.findOne({
                where: { id },
                relations: ['grupo', 'grupo.grado', 'grupo.seccion', 'grupo.modalidad', 'grupo.turno', 'asignatura', 'organizacionLaboral', 'organizacionLaboral.docente'],
            });
            if (!AsignaturaGrupos) {
                throw new NotFoundException(`grupos con asignatura con ID ${id} no encontrada`);
            }
            AsignaturaGrupos.deleted_at = new Date(); // Marcar como eliminado
            AsignaturaGrupos.deleted_at_id = userId; // Asignar el ID del usuario que elimina
            return await this.asignaturaGrupoRepository.save(AsignaturaGrupos);
        } catch (error) {
            Utilities.catchError(error);
        }
    }
}