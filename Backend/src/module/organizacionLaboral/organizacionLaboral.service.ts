import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Utilities } from "src/common/helpers/utilities";
import { Repository } from "typeorm";
import { OrganizacionLaboral } from "./organizacionLaboral.entity";
import { OrganizacionLaboralDTO } from "./organizacionLaboral.dto";



@Injectable()
export class OrganizacionLaboralService {
    constructor(
        @InjectRepository(OrganizacionLaboral)
        private readonly organizacionLaboralRepository: Repository<OrganizacionLaboral>,
    ) { }


    async createOrganizacionLaboral(createOrganizacionLaboralDto: OrganizacionLaboralDTO): Promise<OrganizacionLaboral> {
        try {
            const nuevaOrganizacionLaboral = this.organizacionLaboralRepository.create(createOrganizacionLaboralDto);
            return await this.organizacionLaboralRepository.save(nuevaOrganizacionLaboral);
        } catch (error) {
            Utilities.catchError(error);
        }
    }

    async getOrganizacionLaboral(): Promise<OrganizacionLaboral[]> {
        try {
            const data = await this.organizacionLaboralRepository.find({
                relations: ['docente', 'docente.sexo', 'docente.nivel_academico', 'docente.profession',
                    'docente.pais', 'docente.municipio', 'docente.municipio.departamento', 'añolectivo',
                    'grupoGuia', 'grupoGuia.grado', 'grupoGuia.modalidad', 'grupoGuia.turno', 'grupoGuia.seccion'],
            });

            return data;
        } catch (error) {
            Utilities.catchError(error);
        }
    }


    async getOrganizacionLaboralById(id: number): Promise<OrganizacionLaboral> {
        try {
            const organizacionLaboral = await this.organizacionLaboralRepository.findOne({
                where: { id },
                relations: ['docente', 'docente.sexo', 'docente.nivel_academico', 'docente.profession',
                    'docente.pais', 'docente.municipio', 'docente.municipio.departamento', 'añolectivo',
                    'grupoGuia', 'grupoGuia.grado', 'grupoGuia.modalidad', 'grupoGuia.turno', 'grupoGuia.seccion'],
            });
            if (!organizacionLaboral) {
                throw new NotFoundException(`Organización laboral con ID ${id} no encontrada`);
            }
            return organizacionLaboral;
        } catch (error) {
            Utilities.catchError(error);
        }
    }

    async updateOrganizacionLaboral(id: number, updateOrganizacionLaboralDto: OrganizacionLaboralDTO): Promise<OrganizacionLaboral> {
        try {
            const organizacionLaboral = await this.organizacionLaboralRepository.findOne({
                where: { id },
                relations: ['docente', 'docente.sexo', 'docente.nivel_academico', 'docente.profession',
                    'docente.pais', 'docente.municipio', 'docente.municipio.departamento', 'añolectivo',
                    'grupoGuia', 'grupoGuia.grado', 'grupoGuia.modalidad', 'grupoGuia.turno', 'grupoGuia.seccion'],
            });

            if (!organizacionLaboral) {
                throw new NotFoundException(`Organización laboral con ID ${id} no encontrada`);
            }

            // Actualizar los campos necesarios
            Object.assign(organizacionLaboral, updateOrganizacionLaboralDto);
            organizacionLaboral.update_at = new Date(); // Actualizar la fecha de actualización
            organizacionLaboral.user_update_id // Asignar el ID del usuario que actualiza

            return await this.organizacionLaboralRepository.save(organizacionLaboral);
        } catch (error) {
            Utilities.catchError(error);
        }
    }

    async deleteOrganizacionLaboral(id: number, userId: number): Promise<OrganizacionLaboral> {
        try {
            const organizacionLaboral = await this.organizacionLaboralRepository.findOne({
                where: { id },
                relations: ['docente', 'docente.sexo', 'docente.nivel_academico', 'docente.profession',
                    'docente.pais', 'docente.municipio', 'docente.municipio.departamento', 'añolectivo',
                    'grupoGuia', 'grupoGuia.grado', 'grupoGuia.modalidad', 'grupoGuia.turno', 'grupoGuia.seccion'],
            });
            if (!organizacionLaboral) {
                throw new NotFoundException(`Organización laboral con ID ${id} no encontrada`);
            }
            organizacionLaboral.deleted_at = new Date(); // Marcar como eliminado
            organizacionLaboral.deleted_at_id = userId; // Asignar el ID del usuario que elimina
            return await this.organizacionLaboralRepository.save(organizacionLaboral);
        } catch (error) {
            Utilities.catchError(error);
        }
    }
}