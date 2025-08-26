import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Utilities } from '../../../common/helpers/utilities';
import { GruposConEstudiantes } from '../entities/grupos-con-estudiantes.entity';
import { CreateGruposConEstudiantesDto } from '../dtos/grupos-con-estudiantes.dto';
import { Grupos } from '../entities/grupos.entity';

@Injectable()
export class GruposConEstudiantesService {
    constructor(
        @InjectRepository(GruposConEstudiantes)
        private grupoConEstudianteRepository: Repository<GruposConEstudiantes>,

        @InjectRepository(Grupos)
        private grupoRepo: Repository<Grupos>
    ) { }

    async ListarEstudiantesDeGrupo(id: number) {
        return this.grupoConEstudianteRepository.find({
            where: { grupo: { id } },
            relations: ['estudiante', "estudiante.gender"],
        });
    }

    async remove(id: number) {
        return this.grupoConEstudianteRepository.delete(id);
    }

    async findByGrupo(id: number) {
        return this.grupoConEstudianteRepository.find({
            where: { grupo: { id } },
        });
    }

    async asignarEstudianteAGrupo(dto: CreateGruposConEstudiantesDto): Promise<GruposConEstudiantes> {
        try {
            // 1. Buscar el grupo con su organización escolar y año
            const searchGroups = await this.grupoRepo.findOne({
                where: { id: dto.grupo.id },
                relations: ["organizacionEscolar", "organizacionEscolar.anio_lectivo"],
            });

            if (!searchGroups) {
                throw new Error("El grupo no existe");
            }

            const anioEscolarId = searchGroups.organizacionEscolar.anio_lectivo.id;


            // 2. Revisar si ya está asignado a un grupo de ese año
            const existe = await this.grupoConEstudianteRepository
                .createQueryBuilder("eg")
                .innerJoinAndSelect("eg.grupo", "grupo")
                .innerJoinAndSelect("grupo.grado", "grado")
                .innerJoinAndSelect("grupo.seccion", "seccion")
                .innerJoinAndSelect("grupo.turno", "turno")
                .innerJoinAndSelect("grupo.organizacionEscolar", "org")
                .innerJoinAndSelect("org.anio_lectivo", "anio")
                .where("eg.estudiante = :estudiante", { estudiante: dto.estudiante.id })
                .andWhere("anio.id = :anioEscolarId", { anioEscolarId })
                .getOne();

            if (existe) {
                throw new Error(
                    `El estudiante ya está asignado al grupo "${`${existe.grupo.grado.grades} - ${existe.grupo.seccion.seccion} - ${existe.grupo.turno.turno}`}" en este año escolar.`
                );
            }


            const asignacion = this.grupoConEstudianteRepository.create(dto);
            console.log(dto)
            console.log(asignacion)
            return await this.grupoConEstudianteRepository.save(asignacion)
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async getGruposConEstudiantes(): Promise<GruposConEstudiantes[]> {
        try {
            const gruposConEstudiantes = await this.grupoConEstudianteRepository
                .createQueryBuilder('grupos_con_Estudiantes')
                .leftJoinAndSelect('grupos_con_Estudiantes.grupo', 'grupo')
                .leftJoinAndSelect("grupo.organizacionEscolar", "organizacionEscolar")
                .leftJoinAndSelect("organizacionEscolar.anio_lectivo", "anio_lectivo")
                .leftJoinAndSelect("organizacionEscolar.turno", "turnoOrganizacion")
                .leftJoinAndSelect("organizacionEscolar.cortes", "cortes")
                .leftJoinAndSelect('grupo.grado', 'grado')
                .leftJoinAndSelect('grupo.seccion', 'seccion')
                .leftJoinAndSelect('grupo.turno', 'turno')
                .leftJoinAndSelect('turno.modalidad', 'modalidad')
                .leftJoinAndSelect('grupo.docenteGuia', 'docenteGuia')
                .leftJoinAndSelect('grupos_con_Estudiantes.estudiante', 'estudiante')
                .getMany();

            return gruposConEstudiantes;
        } catch (error) {
            Utilities.catchError(error);
        }
    }


    async obtenerEstudiantesAsignados(grupoId: number) {
        return await this.grupoConEstudianteRepository.find({
            where: {
                grupo: { id: grupoId },
            },
            relations: ['estudiante', "estudiante.gender"],
        });
    }

    // asigno un estudiante a otro grupo
    async actualizarGrupoDeUnEstudiante(id: number, payload: CreateGruposConEstudiantesDto) {
        try {
            const relacion = await this.grupoConEstudianteRepository.findOne({
                where: { id: id },
            });

            if (!relacion) {
                throw new NotFoundException('Relación estudiante-grupo no encontrada');
            }

            Object.assign(relacion, payload);

            // Asignar la fecha de actualización y el usuario que modifica
            relacion.update_at = new Date();
            relacion.user_update_id;

            // relacion.grupoId = await this.grupoRepo.findOneBy({ id: dto.id });

            return await this.grupoConEstudianteRepository.save(relacion);
        } catch (error) {
            Utilities.catchError(error)
        }
    }
}
