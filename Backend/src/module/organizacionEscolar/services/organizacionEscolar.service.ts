import { Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrganizacionEscolarDTO } from '../dtos/organizacionEscolar.dto';
import { Utilities } from 'src/common/helpers/utilities';
import { OrganizacionEscolar } from '../entities/organizacionEscolar.entity';
import { Grupos } from '../entities/grupos.entity';
import { GrupoAsignaturaDocente } from '../entities/GrupoAsignaturaDocente.entity';
import { GrupoAsignaturaConEstudiantes } from '../entities/grupo-asignatura-con-estudiantes.entity';
import { EsquelaHeadEntity } from 'src/module/calificaciones/esquela_head/entities/squela_head.entity';
import { EsquelaRow } from 'src/module/calificaciones/esquelas_rows/esquelas_rows.entity';

@Injectable()
export class OrganizacionEscolarService {
  constructor(
    @InjectRepository(OrganizacionEscolar)
    private organizacionEscolarRepo: Repository<OrganizacionEscolar>,
  ) { }

  async createOrganizacion(
    payload: CreateOrganizacionEscolarDTO,
  ): Promise<OrganizacionEscolar> {
    try {
      const nuevaOrganizacion = this.organizacionEscolarRepo.create(payload);
      return await this.organizacionEscolarRepo.save(nuevaOrganizacion)
    } catch (error) {
      Utilities.catchError(error)
    }
  }

  async getOrganizacion(): Promise<OrganizacionEscolar[]> {
    try {
      const organizacion = await this.organizacionEscolarRepo
        .createQueryBuilder('organizacionEscolar')
        .leftJoinAndSelect('organizacionEscolar.anio_lectivo', 'anio_lectivo')
        .leftJoinAndSelect('organizacionEscolar.grupos', 'grupos')
        .leftJoinAndSelect('grupos.grado', 'grado')
        .leftJoinAndSelect('grupos.seccion', 'seccion')
        .leftJoinAndSelect('grupos.docenteGuia', 'docenteGuia')
        .leftJoinAndSelect('organizacionEscolar.turno', 'turno')
        .leftJoinAndSelect('turno.modalidad', 'modalidad')
        .orderBy('anio_lectivo.anio_lectivo', 'DESC')
        .getMany();

      return organizacion;
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async getOrganizacionById(id: number): Promise<OrganizacionEscolar> {
    try {
      const organizacion = await this.organizacionEscolarRepo
        .createQueryBuilder('organizacionEscolar')
        .leftJoinAndSelect('organizacionEscolar.anio_lectivo', 'anio_lectivo')
        .leftJoinAndSelect('organizacionEscolar.grupos', 'grupos')
        .leftJoinAndSelect('grupos.grado', 'grado')
        .leftJoinAndSelect('grupos.seccion', 'seccion')
        .leftJoinAndSelect('grupos.docenteGuia', 'docenteGuia')
        .leftJoinAndSelect('grupos.grupoAsignaturaDocente', 'grupoAsignaturaDocente')
        .leftJoinAndSelect('grupoAsignaturaDocente.asignatura', 'asignatura')
        .leftJoinAndSelect('grupoAsignaturaDocente.gruposConEstudiantes', 'gruposConEstudiantes')
        .leftJoinAndSelect('gruposConEstudiantes.estudiante', 'estudiante')
        .leftJoinAndSelect('organizacionEscolar.turno', 'organizacion_turno')
        .leftJoinAndSelect('organizacion_turno.modalidad', 'organizacion_modalidad')
        .where('organizacionEscolar.id = :id', { id })
        .orderBy('anio_lectivo.anio_lectivo', 'DESC')
        .getOne();

      return organizacion ?? null;
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async editOrganizacion(
    id: number,
    payload: CreateOrganizacionEscolarDTO,
  ): Promise<OrganizacionEscolar> {
    try {
      const organizacion = await this.organizacionEscolarRepo.findOne({
        where: { id },
        relations: ['anio_lectivo', "turno"],
      });
      if (!organizacion) {
        throw new NotFoundException('Organizacion Escolar no encontrada');
      }
      // Actualizar solo los campos enviados, conservando los valores previos
      Object.assign(organizacion, payload);

      // Asignar la fecha de actualización y el usuario que modifica
      organizacion.update_at = new Date();
      organizacion.user_update_id;

      return await this.organizacionEscolarRepo.save(organizacion);
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async deleteOrganizacion(
    id: number,
    userId: number,
  ): Promise<OrganizacionEscolar> {
    try {
      return await this.organizacionEscolarRepo.manager.transaction(async (manager) => {
        const organizacion = await manager.getRepository(OrganizacionEscolar).findOne({
          where: { id },
          relations: ['grupos'],
        });
        if (!organizacion) {
          throw new NotFoundException('Organizacion escolar no encontrada');
        }

        const ahora = new Date();

        const grupoIds = (organizacion.grupos ?? [])
          .map((grupo) => grupo.id)
          .filter((grupoId) => Number.isFinite(grupoId));

        if (grupoIds.length > 0) {
          // 1. grupo_asignatura_con_estudiantes (soft delete en cascada)
          const gadRows = await manager
            .getRepository(GrupoAsignaturaDocente)
            .createQueryBuilder('gad')
            .select('gad.id', 'id')
            .where('gad.grupo_id IN (:...grupoIds)', { grupoIds })
            .getRawMany();

          const gadIds = gadRows
            .map((row) => row.id)
            .filter((gadId) => Number.isFinite(gadId));

          if (gadIds.length > 0) {
            await manager
              .createQueryBuilder()
              .update(GrupoAsignaturaConEstudiantes)
              .set({ deleted_at: ahora, deleted_at_id: userId })
              .where('grupoAsignaturaDocenteId IN (:...gadIds)', { gadIds })
              .execute();
          }

          // 2. grupo_asignatura_docente (soft delete en cascada)
          await manager
            .createQueryBuilder()
            .update(GrupoAsignaturaDocente)
            .set({ deleted_at: ahora, deleted_at_id: userId })
            .where('grupo_id IN (:...grupoIds)', { grupoIds })
            .execute();

          // 3. Esquelas (head y filas) ligadas a los grupos
          const esquelaHeadRows = await manager
            .getRepository(EsquelaHeadEntity)
            .createQueryBuilder('eh')
            .select('eh.id', 'id')
            .where('eh.grupo_asignatura IN (:...grupoIds)', { grupoIds })
            .getRawMany();

          const esquelaHeadIds = esquelaHeadRows
            .map((row) => row.id)
            .filter((ehId) => Number.isFinite(ehId));

          if (esquelaHeadIds.length > 0) {
            await manager
              .createQueryBuilder()
              .update(EsquelaRow)
              .set({ deleted_at: ahora })
              .where('esquelaHead_id IN (:...esquelaHeadIds)', { esquelaHeadIds })
              .execute();

            await manager
              .createQueryBuilder()
              .update(EsquelaHeadEntity)
              .set({ deleted_at: ahora, deleted_at_id: userId })
              .where('id IN (:...esquelaHeadIds)', { esquelaHeadIds })
              .execute();
          }

          // 4. Grupos (soft delete en cascada)
          await manager.getRepository(Grupos).update(
            { id: In(grupoIds) },
            { deleted_at: ahora, deleted_at_id: userId },
          );
        }

        // 5. Organización escolar (soft delete)
        organizacion.deleted_at = ahora;
        organizacion.deleted_at_id = userId;

        return await manager.getRepository(OrganizacionEscolar).save(organizacion);
      });
    } catch (error) {
      Utilities.catchError(error);
    }
  }
}
