import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Docentes } from './docentes.entity';
import { DeepPartial, Repository } from 'typeorm';
import { DocentesDTO } from './docentes.dto';
import { Utilities } from '../../common/helpers/utilities';
import { promises } from 'dns';

@Injectable()
export class DocentesService {
  constructor(
    @InjectRepository(Docentes)
    private readonly docenteRepository: Repository<Docentes>,
  ) { }

  async createDocente(createDocenteDto: DocentesDTO, file?: Express.Multer.File): Promise<Docentes> {
    try {
      if (file) {
        createDocenteDto.foto_docente = `uploads/docentes/${file.filename}`; // guardar el nombre del archivo
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
      const docente = await this.docenteRepository.find({
        relations: [
          'sexo',
          'nivel_academico',
          'profession',
          'pais',
          'municipio',
        ],
      });
      return docente;
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async getDocenteById(id: number): Promise<Docentes> {
    try {
      const docente = await this.docenteRepository
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
        .leftJoinAndSelect("turno.modalidad", "modalidad")
        .leftJoinAndSelect('grupos.organizacionEscolar', 'organizacionEscolar')
        .leftJoinAndSelect('organizacionEscolar.anio_lectivo', 'anio_lectivo')
        .leftJoinAndSelect('grupos.esquelaHead', 'esquelaHead')
        .where('docente.id = :id', { id })
        .getOne()
      return docente;
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async getGradosByDocenteId(id: number): Promise<Docentes> {
    try {
      const docente = await this.docenteRepository
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
        .where('docente.id = :id', { id })
        .getOne()
      return docente;
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async editDocente(id: number, payload: DocentesDTO, file?: Express.Multer.File): Promise<Docentes> {
    try {
      const docente = await this.docenteRepository.findOne({
        where: { id },
        relations: [
          'sexo',
          'nivel_academico',
          'profession',
          'pais',
          'municipio',
        ],
      });

      if (!docente) {
        throw new NotFoundException('Docente no encontrada');
      }

      if (file) {
        payload.foto_docente = `uploads/docentes/${file.filename}`;
      }
      // Actualizar solo los campos enviados, conservando los valores previos
      Object.assign(docente, payload);

      // Asignar la fecha de actualización y el usuario que modifica
      docente.update_at = new Date();
      docente.user_update_id;

      return await this.docenteRepository.save(docente);
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async deleteDocente(id: number, userId: number): Promise<Docentes> {
    try {
      const docente = await this.docenteRepository.findOne({
        where: { id },
        relations: [
          'sexo',
          'nivel_academico',
          'profession',
          'pais',
          'municipio',
        ],
      });
      if (!docente) {
        throw new NotFoundException('Profesión no encontrada');
      }

      // Registrar el usuario que eliminó y la fecha de eliminación
      docente.deleted_at = new Date();
      docente.deleted_at_id = userId;

      return await this.docenteRepository.save(docente);
    } catch (error) {
      Utilities.catchError(error);
    }
  }
}
