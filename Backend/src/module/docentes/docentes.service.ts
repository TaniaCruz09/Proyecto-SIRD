import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Docentes } from './docentes.entity';
import { DeepPartial, IsNull, Repository } from 'typeorm';
import { DocentesDTO } from './docentes.dto';
import { Utilities } from '../../common/helpers/utilities';
import { GrupoAsignaturaDocente } from '../organizacionEscolar/entities/GrupoAsignaturaDocente.entity';

@Injectable()
export class DocentesService {
  constructor(
    @InjectRepository(Docentes)
    private readonly docenteRepository: Repository<Docentes>,
  ) { }

  private defaultRelations = [
    'sexo',
    'nivel_academico',
    'profession',
    'pais',
    'municipio',
  ];

  async createDocente(createDocenteDto: DocentesDTO, file?: Express.Multer.File): Promise<Docentes> {
    try {

      // const nuevoDocente = this.docenteRepository.create(createDocenteDto);
      // return await this.docenteRepository.save(nuevoDocente);
      if (file) {
        createDocenteDto.foto_docente = `/uploads/docentes/${file.filename}`; // guardar el nombre del archivo
      }
      const nuevoDocente = await this.docenteRepository.create(
        createDocenteDto,
      );
      return this.docenteRepository.save(nuevoDocente);
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async getDocente(): Promise<Docentes[]> {
    try {
      return await this.docenteRepository
        .createQueryBuilder('docente')
        .leftJoinAndSelect('docente.sexo', 'sexo')
        .leftJoinAndSelect('docente.nivel_academico', 'nivel_academico')
        .leftJoinAndSelect('docente.profession', 'profession')
        .leftJoinAndSelect('docente.pais', 'pais')
        .leftJoinAndSelect('docente.municipio', 'municipio')
        .where('docente.deleted_at IS NULL')
        .getMany();
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async getDocenteById(id: number): Promise<Docentes> {
    try {
      return await this.docenteRepository
        .createQueryBuilder('docente')
        .leftJoinAndSelect('docente.sexo', 'sexo')
        .leftJoinAndSelect('docente.nivel_academico', 'nivel_academico')
        .leftJoinAndSelect('docente.profession', 'profession')
        .leftJoinAndSelect('docente.pais', 'pais')
        .leftJoinAndSelect('docente.municipio', 'municipio')

        .leftJoinAndSelect('docente.grupos', 'grupos')
        .leftJoinAndSelect('grupos.grado', 'grado')
        .leftJoinAndSelect('grupos.seccion', 'seccion')
        .leftJoinAndSelect('grupos.turno', 'turno')
        .leftJoinAndSelect('turno.modalidad', 'modalidad')

        .leftJoinAndSelect('grupos.organizacionEscolar', 'organizacionEscolar')
        .leftJoinAndSelect('organizacionEscolar.anio_lectivo', 'anio_lectivo')

        .leftJoinAndSelect(
          'grupos.grupoAsignaturaDocente',
          'grupoAsignaturaDocente'
        )
        .leftJoinAndSelect('grupoAsignaturaDocente.asignatura', 'asignatura')
        .leftJoinAndSelect(
          'grupoAsignaturaDocente.gruposConEstudiantes',
          'gruposConEstudiantes',
          'gruposConEstudiantes.deleted_at IS NULL',
        )
        .leftJoinAndSelect('gruposConEstudiantes.estudiante', 'estudiante')

        .leftJoinAndSelect('grupos.esquelaHead', 'esquelaHead')

        .where('docente.id = :id', { id })
        .andWhere('docente.deleted_at IS NULL')
        .getOne();
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async getGradosByDocenteId(id: number): Promise<Docentes> {
    try {
      return await this.docenteRepository
        .createQueryBuilder('docente')
        .leftJoinAndSelect('docente.grupoAsignaturaDocente', 'grupoAsignaturaDocente')
        .leftJoinAndSelect('grupoAsignaturaDocente.grupo', 'grupo')
        .leftJoinAndSelect('grupo.grado', 'grado')
        .leftJoinAndSelect('grupo.seccion', 'seccion')
        .leftJoinAndSelect('grupo.turno', 'turno')
        .leftJoinAndSelect('turno.modalidad', 'modalidad')
        .leftJoinAndSelect('grupo.organizacionEscolar', 'organizacionEscolar')
        .leftJoinAndSelect('organizacionEscolar.anio_lectivo', 'anio_lectivo')
        .leftJoinAndSelect('grupoAsignaturaDocente.asignatura', 'asignatura')
        .leftJoinAndSelect(
          'grupoAsignaturaDocente.gruposConEstudiantes',
          'gruposConEstudiantes',
          'gruposConEstudiantes.deleted_at IS NULL AND gruposConEstudiantes.activo = :activo',
          { activo: true },
        )
        .leftJoinAndSelect('gruposConEstudiantes.estudiante', 'estudiante')
        .where('docente.id = :id', { id })
        .andWhere('docente.deleted_at IS NULL')
        .getOne();
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async editDocente(id: number, payload: DocentesDTO, file?: Express.Multer.File): Promise<Docentes> {
    try {
      const docente = await this.docenteRepository.findOne({
        where: { id, deleted_at: IsNull() },
        relations: this.defaultRelations,
      });

      if (!docente) {
        throw new NotFoundException('Docente no encontrada');
      }


      if (file) {
        payload.foto_docente = `/uploads/docentes/${file.filename}`;
      }
      // Actualizar solo los campos enviados, conservando los valores previos
      Object.assign(docente, payload);

      docente.update_at = new Date();

      return await this.docenteRepository.save(docente);
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async deleteDocente(id: number, userId: number): Promise<Docentes> {
    try {
      return await this.docenteRepository.manager.transaction(async (manager) => {
        const docente = await manager.getRepository(Docentes).findOne({
          where: { id, deleted_at: IsNull() },
          relations: this.defaultRelations,
        });

        if (!docente) {
          throw new NotFoundException('Docente no encontrado');
        }

        const deletedAt = new Date();

        // Cascade 1: Soft-delete GrupoAsignaturaDocente (subject assignments)
        await manager
          .getRepository(GrupoAsignaturaDocente)
          .createQueryBuilder()
          .update(GrupoAsignaturaDocente)
          .set({
            activo: false,
            deleted_at: deletedAt,
            deleted_at_id: userId,
            user_update_id: userId,
            update_at: deletedAt,
          })
          .where('docente_id = :id', { id })
          .andWhere('deleted_at IS NULL')
          .execute();

        // Mark docente as deleted
        docente.deleted_at = deletedAt;
        docente.deleted_at_id = userId;

        return await manager.getRepository(Docentes).save(docente);
      });
    } catch (error) {
      Utilities.catchError(error);
    }
  }
}
