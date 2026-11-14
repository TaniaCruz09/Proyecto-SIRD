import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Docentes } from './docentes.entity';
import { DeepPartial, IsNull, Repository } from 'typeorm';
import { DocentesDTO } from './docentes.dto';
import { GrupoAsignaturaDocente } from '../organizacionEscolar/entities/GrupoAsignaturaDocente.entity';
import { removeReplacedFile } from '../../common/uploads/upload-cleanup';

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

  private normalizar(valor?: string | null): string {
    return (valor ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  }

  /** Busca otro docente ACTIVO con la misma cédula (los eliminados la liberan). */
  async existeCedula(
    cedula?: string | null,
    excluirId?: number,
  ): Promise<{ existe: boolean }> {
    const normalizada = this.normalizar(cedula);
    if (!normalizada) return { existe: false };

    const query = this.docenteRepository
      .createQueryBuilder('docente')
      .where('docente.deleted_at IS NULL')
      .andWhere(
        `regexp_replace(upper(coalesce(docente.cedula_identidad, '')), '[^A-Z0-9]', '', 'g') = :cedula`,
        { cedula: normalizada },
      );

    if (excluirId) {
      query.andWhere('docente.id <> :excluirId', { excluirId });
    }

    const encontrados = await query.getMany();
    const encontrado = encontrados.find(
      (item) => this.normalizar(item.cedula_identidad) === normalizada,
    );

    return { existe: Boolean(encontrado) };
  }

  private async validarCedulaUnica(
    cedula?: string | null,
    excluirId?: number,
  ): Promise<void> {
    const { existe } = await this.existeCedula(cedula, excluirId);
    if (!existe) return;

    throw new ConflictException(
      `Ya existe un docente con la cedula ${(cedula ?? '').trim()}`,
    );
  }

  async createDocente(createDocenteDto: DocentesDTO, file?: Express.Multer.File): Promise<Docentes> {
    await this.validarCedulaUnica(createDocenteDto.cedula_identidad);

    if (file) {
      createDocenteDto.foto_docente = `/uploads/docentes/${file.filename}`; // guardar el nombre del archivo
    }
    const nuevoDocente = await this.docenteRepository.create(
      createDocenteDto,
    );
    return this.docenteRepository.save(nuevoDocente);
  }

  async getDocente(): Promise<Docentes[]> {
    return await this.docenteRepository
      .createQueryBuilder('docente')
      .leftJoinAndSelect('docente.sexo', 'sexo')
      .leftJoinAndSelect('docente.nivel_academico', 'nivel_academico')
      .leftJoinAndSelect('docente.profession', 'profession')
      .leftJoinAndSelect('docente.pais', 'pais')
      .leftJoinAndSelect('docente.municipio', 'municipio')
      .where('docente.deleted_at IS NULL')
      .getMany();
  }

  async getDocenteById(id: number): Promise<Docentes> {
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

      .leftJoinAndSelect('grupos.organizacionEscolar', 'organizacionEscolar')
      .leftJoinAndSelect('organizacionEscolar.turno', 'turno')
      .leftJoinAndSelect('turno.modalidad', 'modalidad')
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
  }

  async getGradosByDocenteId(id: number): Promise<Docentes> {
    return await this.docenteRepository
      .createQueryBuilder('docente')
      .leftJoinAndSelect('docente.grupoAsignaturaDocente', 'grupoAsignaturaDocente')
      .leftJoinAndSelect('grupoAsignaturaDocente.grupo', 'grupo')
      .leftJoinAndSelect('grupo.grado', 'grado')
      .leftJoinAndSelect('grupo.seccion', 'seccion')
      .leftJoinAndSelect('grupo.organizacionEscolar', 'organizacionEscolar')
      .leftJoinAndSelect('organizacionEscolar.turno', 'turno')
      .leftJoinAndSelect('turno.modalidad', 'modalidad')
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
  }

  async editDocente(id: number, payload: DocentesDTO, file?: Express.Multer.File): Promise<Docentes> {
    const docente = await this.docenteRepository.findOne({
      where: { id, deleted_at: IsNull() },
      relations: this.defaultRelations,
    });

    if (!docente) {
      throw new NotFoundException('Docente no encontrada');
    }

    await this.validarCedulaUnica(
      payload.cedula_identidad ?? docente.cedula_identidad,
      docente.id,
    );

    const fotoAnterior = docente.foto_docente;

    if (file) {
      payload.foto_docente = `/uploads/docentes/${file.filename}`;
    }
    // Actualizar solo los campos enviados, conservando los valores previos
    Object.assign(docente, payload);

    docente.update_at = new Date();

    const actualizado = await this.docenteRepository.save(docente);
    await removeReplacedFile(fotoAnterior, actualizado.foto_docente);

    return actualizado;
  }

  async deleteDocente(id: number, userId: number): Promise<Docentes> {
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
  }
}
