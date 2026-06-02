import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Grupos } from '../entities/grupos.entity';
import { In, Repository } from 'typeorm';
import { Utilities } from '../../../common/helpers/utilities';
import { CreateGrupoDto } from '../../organizacionEscolar/dtos/grupos.dto';
import { UpdateGrupoDto } from '../../organizacionEscolar/dtos/Update-grupo.dto';
import { GrupoAsignaturaDocente } from '../entities/GrupoAsignaturaDocente.entity';
import { GrupoAsignaturaConEstudiantes } from '../entities/grupo-asignatura-con-estudiantes.entity';
import { EsquelaHeadEntity } from 'src/module/calificaciones/esquela_head/entities/squela_head.entity';
import { EsquelaRow } from 'src/module/calificaciones/esquelas_rows/esquelas_rows.entity';


@Injectable()
export class GruposService {
    constructor(
        @InjectRepository(Grupos)
        private grupoRepository: Repository<Grupos>
    ) { }

    async createGrupo(createGrupoDto: CreateGrupoDto): Promise<Grupos> {
        try {
            const nuevoGrupo = this.grupoRepository.create(createGrupoDto);
            return await this.grupoRepository.save(nuevoGrupo)
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async getGrupo(): Promise<Grupos[]> {
        try {
            const grupos = await this.grupoRepository
                .createQueryBuilder("grupo")
                .leftJoinAndSelect("grupo.organizacionEscolar", "organizacionEscolar")
                .leftJoinAndSelect("organizacionEscolar.anio_lectivo", "anio_lectivo")
                .leftJoinAndSelect("organizacionEscolar.turno", "turnoOrganizacion")
                .leftJoinAndSelect("grupo.grado", "grado")
                .leftJoinAndSelect("grupo.seccion", "seccion")
                .leftJoinAndSelect("grupo.turno", "turno")
                .leftJoinAndSelect("turno.modalidad", "modalidad")
                // .leftJoinAndSelect("grupo.docenteGuia", "docenteGuia")
                .leftJoinAndSelect("grupo.esquelaHead", "esquelaHead")
                .leftJoinAndSelect("grupo.docenteGuia", "docenteGuia", undefined, { withDeleted: true })
                .getMany();

            return grupos;
        } catch (error) {
            Utilities.catchError(error);
        }
    }


    async getGrupoById(id: number): Promise<Grupos> {
        try {
            const grupo = await this.grupoRepository
                .createQueryBuilder("grupo")
                .leftJoinAndSelect("grupo.organizacionEscolar", "organizacionEscolar")
                .leftJoinAndSelect("organizacionEscolar.anio_lectivo", "anio_lectivo")
                .leftJoinAndSelect("organizacionEscolar.turno", "turnoOrganizacion")
                .leftJoinAndSelect("grupo.grado", "grado")
                .leftJoinAndSelect("grupo.seccion", "seccion")
                .leftJoinAndSelect("grupo.turno", "turno")
                .leftJoinAndSelect("turno.modalidad", "modalidad")
                .leftJoinAndSelect("grupo.docenteGuia", "docenteGuia")
                .leftJoinAndSelect("grupo.grupoAsignaturaDocente", "grupoAsignaturaDocente")
                .leftJoinAndSelect("grupoAsignaturaDocente.asignatura", "asignatura")
                .leftJoinAndSelect("asignatura.calificacion", "calificacion")
                .leftJoinAndSelect("calificacion.corte", "corte")
                .leftJoinAndSelect("grupoAsignaturaDocente.docente", "docente")
                .leftJoinAndSelect("grupoAsignaturaDocente.gruposConEstudiantes", "gruposConEstudiantes")
                .leftJoinAndSelect("gruposConEstudiantes.estudiante", "estudiante")
                .leftJoinAndSelect("estudiante.gender", "gender")
                .where("grupo.id = :id", { id })
                .getOne();

            return grupo;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async getStudentByGrupoId(id: number): Promise<Grupos[]> {
        try {
            const estudiantes = await this.grupoRepository
                .createQueryBuilder("grupo")
                .getMany()
            return estudiantes
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async getGruposPorAnioYGrado(anioId: number, gradoId: number) {
        const grupos = await this.grupoRepository
            .createQueryBuilder('grupo')
            .leftJoinAndSelect('grupo.organizacionEscolar', 'org')
            .leftJoinAndSelect('org.anio_lectivo', 'anio')
            .leftJoinAndSelect('grupo.grado', 'grado')
            .leftJoinAndSelect('grupo.seccion', 'seccion')
            .leftJoinAndSelect('grupo.turno', 'turno')
            .leftJoinAndSelect('turno.modalidad', 'modalidad')
            .where('anio.id = :anioId', { anioId })
            .andWhere('grado.id = :gradoId', { gradoId }) // <-- filtro por grado
            .getMany();

        return grupos;
    }

    async deleteGrupos(id: number): Promise<Grupos> {
        try {
            const grupos = await this.grupoRepository.findOne({
                where: { id: id }
            });

            if (!grupos) {
                throw new NotFoundException(`Grupo con ID ${id} no encontrado`);
            }

            await this.grupoRepository.manager.transaction(async (manager) => {
                const esquelaHeads = await manager.getRepository(EsquelaHeadEntity).find({
                    select: ['id'],
                    where: { grupo_asignatura: { id } },
                });

                const esquelaHeadIds = esquelaHeads.map((item) => item.id);

                if (esquelaHeadIds.length > 0) {
                    await manager.getRepository(EsquelaRow).delete({
                        esquelaHead: { id: In(esquelaHeadIds) },
                    });
                }

                await manager.getRepository(EsquelaHeadEntity).delete({
                    grupo_asignatura: { id },
                });

                await manager
                    .createQueryBuilder()
                    .delete()
                    .from(GrupoAsignaturaConEstudiantes)
                    .where(`"grupoAsignaturaDocenteId" IN (
                        SELECT gad.id
                        FROM "organizacion_escolar"."grupo_asignatura_docente" gad
                        WHERE gad."grupo_id" = :grupoId
                    )`, { grupoId: id })
                    .execute();

                await manager
                    .getRepository(GrupoAsignaturaDocente)
                    .delete({ grupo: { id } });

                await manager
                    .getRepository(Grupos)
                    .remove(grupos);
            });

            return grupos;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async updateGrupos(id: number, payload: UpdateGrupoDto): Promise<Grupos> {
        try {
            const grupos = await this.grupoRepository.preload({ id, ...payload });
            if (!grupos) throw new NotFoundException(`Grupos con ID ${id} no encontrado`);
            return await this.grupoRepository.save(grupos);
        } catch (error) {
            Utilities.catchError(error)
        }
    }
}
