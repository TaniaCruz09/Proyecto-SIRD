import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Utilities } from '../../../common/helpers/utilities';
import { Grupos } from '../entities/grupos.entity';
import { GrupoAsignaturaConEstudiantes } from '../entities/grupo-asignatura-con-estudiantes.entity';
import { AsignarEstudianteAGrupoDto } from '../dtos/grupos-asignatura-con-estudiantes.dto';
import { GrupoAsignaturaDocente } from '../entities/GrupoAsignaturaDocente.entity';
import { EsquelaHeadEntity } from '../../calificaciones/esquela_head/entities/squela_head.entity';
import { EsquelaRow } from '../../calificaciones/esquelas_rows/esquelas_rows.entity';

@Injectable()
export class GrupoAsignaturaConEstudiantesService {
    constructor(
        @InjectRepository(GrupoAsignaturaConEstudiantes)
        private grupoConEstudianteRepo: Repository<GrupoAsignaturaConEstudiantes>,

        @InjectRepository(Grupos)
        private grupoRepo: Repository<Grupos>,

        @InjectRepository(GrupoAsignaturaDocente)
        private grupoAsignaturaDocenteRepo: Repository<GrupoAsignaturaDocente>,

        @InjectRepository(EsquelaHeadEntity)
        private esquelaHeadRepo: Repository<EsquelaHeadEntity>,

        @InjectRepository(EsquelaRow)
        private esquelaRowRepo: Repository<EsquelaRow>,
    ) { }

    async saveEstudianteAGrupo(dto: AsignarEstudianteAGrupoDto): Promise<GrupoAsignaturaConEstudiantes> {
        try {
            // 1️⃣ Buscar GrupoAsignaturaDocente con su grupo y año escolar
            const gca = await this.grupoAsignaturaDocenteRepo
                .createQueryBuilder('gca')
                .leftJoinAndSelect('gca.grupo', 'grupo')
                .leftJoinAndSelect('grupo.organizacionEscolar', 'org')
                .leftJoinAndSelect('org.anio_lectivo', 'anio')
                .where('gca.id = :id', { id: dto.grupoAsignaturaDocente.id })
                .getOne();

            if (!gca) {
                throw new NotFoundException('El grupo-asignatura-docente no existe');
            }

            const anioId = gca.grupo.organizacionEscolar.anio_lectivo.id;

            // 2️⃣ Verificar si el estudiante ya está en otro grupo del mismo año (pero permitir dentro del mismo grupo)
            const existe = await this.grupoConEstudianteRepo
                .createQueryBuilder('gce')
                .innerJoin('gce.grupoAsignaturaDocente', 'gca')
                .innerJoin('gca.grupo', 'grupo')
                .innerJoin('grupo.organizacionEscolar', 'org')
                .innerJoin('org.anio_lectivo', 'anio')
                .where('gce.estudiante = :estudianteId', { estudianteId: dto.estudiante.id })
                .andWhere('anio.id = :anioId', { anioId })
                .andWhere('grupo.id != :grupoId', { grupoId: gca.grupo.id }) // ❌ no permitir en OTRO grupo del mismo año
                .getOne();

            if (existe) {
                throw new Error('El estudiante ya está asignado a otro grupo en este año escolar');
            }

            // 2️⃣ Verificar si el estudiante ya está asignado a ESTE grupo-asignatura-docente
            const yaAsignado = await this.grupoConEstudianteRepo
                .createQueryBuilder('gce')
                .where('gce.estudiante = :estudianteId', { estudianteId: dto.estudiante.id })
                .andWhere('gce.grupoAsignaturaDocente = :gadId', { gadId: dto.grupoAsignaturaDocente.id })
                .getOne();

            if (yaAsignado) {
                throw new Error('El estudiante ya está asignado a esta asignatura en este grupo');
            }

            // 3️⃣ Crear y guardar la relación
            const asignacion = this.grupoConEstudianteRepo.create(dto);
            return await this.grupoConEstudianteRepo.save(asignacion);

        } catch (error) {
            Utilities.catchError(error);
        }
    }

    async getAllGruposAsignaturasConEstudiantes(): Promise<GrupoAsignaturaConEstudiantes[]> {
        try {
            const gruposConEstudiantes = await this.grupoConEstudianteRepo
                .createQueryBuilder('gce')
                .leftJoinAndSelect('gce.grupoAsignaturaDocente', 'gca')
                .leftJoinAndSelect('gca.asignatura', 'asignatura')
                .leftJoinAndSelect('gca.docente', 'docente')
                .leftJoinAndSelect('gca.grupo', 'grupo')
                .leftJoinAndSelect('grupo.organizacionEscolar', 'organizacionEscolar')
                .leftJoinAndSelect('organizacionEscolar.anio_lectivo', 'anio_lectivo')
                .leftJoinAndSelect('organizacionEscolar.turno', 'turnoOrganizacion')
                .leftJoinAndSelect('grupo.grado', 'grado')
                .leftJoinAndSelect('grupo.seccion', 'seccion')
                .leftJoinAndSelect('grupo.turno', 'turno')
                .leftJoinAndSelect('turno.modalidad', 'modalidad')
                .leftJoinAndSelect('grupo.docenteGuia', 'docenteGuia')
                .leftJoinAndSelect('gce.estudiante', 'estudiante')
                .getMany();

            return gruposConEstudiantes;
        } catch (error) {
            Utilities.catchError(error);
        }
    }

    async obtenerEstudiantesAsignados(grupoId: number) {
        try {
            const data = await this.grupoConEstudianteRepo
                .createQueryBuilder('gce')
                .leftJoinAndSelect('gce.grupoAsignaturaDocente', 'gca')
                .leftJoinAndSelect('gca.asignatura', 'asignatura')
                .leftJoinAndSelect('gca.docente', 'docente')
                .leftJoinAndSelect('gca.grupo', 'grupo')
                .leftJoinAndSelect('grupo.organizacionEscolar', 'organizacionEscolar')
                .leftJoinAndSelect('organizacionEscolar.anio_lectivo', 'anio_lectivo')
                .leftJoinAndSelect('organizacionEscolar.turno', 'turnoOrganizacion')
                .leftJoinAndSelect('grupo.grado', 'grado')
                .leftJoinAndSelect('grupo.seccion', 'seccion')
                .leftJoinAndSelect('grupo.turno', 'turno')
                .leftJoinAndSelect('turno.modalidad', 'modalidad')
                .leftJoinAndSelect('grupo.docenteGuia', 'docenteGuia')
                .leftJoinAndSelect('gce.estudiante', 'estudiante')
                .leftJoinAndSelect('estudiante.gender', 'gender')
                .where("grupo.id = :grupoId", { grupoId })
                .getMany();

            // return data.map(item => ({
            //     asignatura: item.grupoAsignaturaDocente.asignatura,
            //     estudiante: item.estudiante,
            // }))

            return data;
        } catch (error) {
            Utilities.catchError(error);
        }
    }

    async moverEstudianteDeGrupo(
        estudianteId: number,
        grupoOrigenId: number,
        grupoDestinoId: number,
    ) {
        try {
            // 1️⃣ Eliminar todas las asignaciones del estudiante en el grupo de origen
            await this.grupoConEstudianteRepo
                .createQueryBuilder()
                .delete()
                .from(GrupoAsignaturaConEstudiantes)
                .where("estudianteId = :estudianteId", { estudianteId })
                .andWhere(
                    `grupoAsignaturaDocenteId IN (
            SELECT gad.id
            FROM "organizacion_escolar"."grupo_asignatura_docente" gad
            WHERE gad."grupo_id" = :grupoOrigenId
        )`,
                    { grupoOrigenId }
                )
                .execute();

            // 2️⃣ Buscar todas las asignaturas-docente del grupo destino
            const grupoAsignaturasDestino = await this.grupoAsignaturaDocenteRepo
                .createQueryBuilder('gad')
                .leftJoinAndSelect('gad.grupo', 'grupo')
                .leftJoinAndSelect('gad.asignatura', 'asignatura')
                .where('grupo.id = :grupoDestinoId', { grupoDestinoId })
                .getMany();

            if (!grupoAsignaturasDestino.length) {
                throw new Error('El grupo destino no tiene asignaturas asignadas');
            }

            // 3️⃣ Crear nuevas asignaciones para el estudiante en el grupo destino
            const nuevasAsignaciones = grupoAsignaturasDestino.map(gad =>
                this.grupoConEstudianteRepo.create({
                    grupoAsignaturaDocente: { id: gad.id },
                    estudiante: { id: estudianteId },
                })
            );

            // 4️⃣ Guardar todas las nuevas asignaciones
            const resultado = await this.grupoConEstudianteRepo.save(nuevasAsignaciones);

            // 5️⃣ Transferir calificaciones del grupo origen al destino
            const esquelaHeadOrigen = await this.esquelaHeadRepo.findOne({
                where: { grupo_asignatura: { id: grupoOrigenId } },
            });

            if (esquelaHeadOrigen) {
                let esquelaHeadDestino = await this.esquelaHeadRepo.findOne({
                    where: { grupo_asignatura: { id: grupoDestinoId } },
                });

                if (!esquelaHeadDestino) {
                    // Crear uno si no existe
                    esquelaHeadDestino = await this.esquelaHeadRepo.save({
                        grupo_asignatura: { id: grupoDestinoId },
                        user_create_id: 1, // Asumir un usuario, o pasar como parámetro
                    });
                }

                // Buscar todas las EsquelaRow del estudiante en el grupo origen
                const calificacionesOrigen = await this.esquelaRowRepo
                    .createQueryBuilder('er')
                    .where('er.estudiante = :estudianteId', { estudianteId })
                    .andWhere('er.esquelaHead = :esquelaHeadId', { esquelaHeadId: esquelaHeadOrigen.id })
                    .getMany();

                // Para cada calificación, verificar si la asignatura existe en el grupo destino
                const asignaturasDestino = grupoAsignaturasDestino.map(gad => gad.asignatura.id);

                for (const calif of calificacionesOrigen) {
                    if (asignaturasDestino.includes(calif.asignatura.id)) {
                        // Transferir al destino
                        calif.esquelaHead = esquelaHeadDestino;
                        await this.esquelaRowRepo.save(calif);
                    }
                    // Si no, quizás dejarla o eliminarla, pero por ahora transferir solo si coincide
                }
            }

            return {
                message: 'Estudiante movido exitosamente',
                data: resultado
            };
        } catch (error) {
            Utilities.catchError(error);
        }
    }


    async eliminarEstudianteDeGrupoAsignatura(
        idEstudiante: number,
        idGrupo: number,
    ) {
        // 1️⃣ Buscar todas las relaciones con joins
        const relaciones = await this.grupoConEstudianteRepo
            .createQueryBuilder('gce')
            .innerJoin('gce.estudiante', 'estudiante')
            .innerJoin('gce.grupoAsignaturaDocente', 'gad')
            .innerJoin('gad.grupo', 'grupo')
            .where('estudiante.id = :idEstudiante', { idEstudiante })
            .andWhere('grupo.id = :idGrupo', { idGrupo })
            .select(['gce.id']) // solo nos interesa el id de la relación
            .getMany();

        if (relaciones.length === 0) {
            throw new NotFoundException('El estudiante no tiene asignaturas en este grupo');
        }

        // 2️⃣ Extraer los IDs de las relaciones
        const idsAEliminar = relaciones.map(r => r.id);

        // 3️⃣ Eliminar todas en un solo paso
        await this.grupoConEstudianteRepo
            .createQueryBuilder()
            .delete()
            .from('grupo_asignatura_con_estudiantes') // 👈 usa el nombre real de la tabla
            .whereInIds(idsAEliminar)
            .execute();

        // 4️⃣ Retornar confirmación
        return {
            message: `Estudiante eliminado de todas las asignaturas del grupo ${idGrupo}`,
            eliminados: idsAEliminar,
        };
    }

}
