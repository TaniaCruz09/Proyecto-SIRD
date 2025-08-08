import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Utilities } from '../../../common/helpers/utilities';
import { OrganizacionConEstudiantes } from '../entities/organizacionConEstudiante';
import { CreateOrganizacionConEstudiantesDto } from '../dtos/organizacionConEstudiantes.dto';

@Injectable()
export class OrganizacionConEstudiantesService {
    constructor(
        @InjectRepository(OrganizacionConEstudiantes)
        private orgEstRepository: Repository<OrganizacionConEstudiantes>,
    ) { }

    async ListarEstudiantesDeGrupo(id: number) {
        return this.orgEstRepository.find({
            where: { organizacionEscolar: { id } },
            relations: ['estudiante'],
        });
    }

    async remove(id: number) {
        return this.orgEstRepository.delete(id);
    }

    async findByOrganizacion(id: number) {
        return this.orgEstRepository.find({
            where: { organizacionEscolar: { id } },
        });
    }
    async asignarEstudiantes(dto: CreateOrganizacionConEstudiantesDto): Promise<OrganizacionConEstudiantes> {
        try {
            //validar que el estudiante a agregar aun no este asignado a una organizacion escolar
            const yaAsignado = await this.orgEstRepository.findOne({
                where: {
                    estudiante: { id: dto.estudiante.id },
                },
            });

            if (yaAsignado) {
                throw new BadRequestException('Este estudiante ya está asignado a una organización escolar.');
            }
            const nuevoGrupo = this.orgEstRepository.create(dto);
            return await this.orgEstRepository.save(nuevoGrupo)
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async getOrganizacionConEstudiantes(): Promise<OrganizacionConEstudiantes[]> {
        try {
            const organizacionConEstudiantes = await this.orgEstRepository.find({
                relations: ['organizacionEscolar', "organizacionEscolar.anio_lectivo", "organizacionEscolar.grupo", "organizacionEscolar.grupo.grado", "organizacionEscolar.grupo.seccion", "organizacionEscolar.grupo.modalidad",
                    "organizacionEscolar.grupo.turno",
                    "organizacionEscolar.docenteGuia", "organizacionEscolar.docentes", "organizacionEscolar.asignaturas", "organizacionEscolar.cortes", 'estudiante']
            });
            return organizacionConEstudiantes
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async obtenerEstudiantesAsignados(idOrganizacionEscolar: number) {
        return await this.orgEstRepository.find({
            where: {
                organizacionEscolar: { id: idOrganizacionEscolar },
            },
            relations: ['estudiante'], // Asegúrate de incluir aquí cualquier relación que necesites
        });
    }
}
