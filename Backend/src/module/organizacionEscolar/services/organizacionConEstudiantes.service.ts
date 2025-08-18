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
            const organizacionConEstudiantes = await this.orgEstRepository
                .createQueryBuilder('orgEst')
                .leftJoinAndSelect('orgEst.organizacionEscolar', 'organizacionEscolar')
                .leftJoinAndSelect('organizacionEscolar.anio_lectivo', 'anio_lectivo')
                .leftJoinAndSelect('organizacionEscolar.grupo', 'grupo')
                .leftJoinAndSelect('grupo.grado', 'grado')
                .leftJoinAndSelect('grupo.seccion', 'seccion')
                .leftJoinAndSelect('grupo.modalidad', 'modalidad')
                .leftJoinAndSelect('grupo.turno', 'turno')
                .leftJoinAndSelect('organizacionEscolar.docenteGuia', 'docenteGuia')
                .leftJoinAndSelect('organizacionEscolar.docentes', 'docentes')
                .leftJoinAndSelect('organizacionEscolar.asignaturas', 'asignaturas')
                .leftJoinAndSelect('organizacionEscolar.cortes', 'cortes')
                .leftJoinAndSelect('orgEst.estudiante', 'estudiante')
                .getMany();

            return organizacionConEstudiantes;
        } catch (error) {
            Utilities.catchError(error);
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
