import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Docentes } from './docentes.entity';
import { Repository } from 'typeorm';
import { DocentesDTO } from './docentes.dto';
import { Utilities } from '../../common/helpers/utilities';

@Injectable()
export class DocentesService {
  constructor(
    @InjectRepository(Docentes)
    private readonly docenteRepository: Repository<Docentes>,
  ) {}

  private defaultRelations = [
    'sexo',
    'nivel_academico',
    'profession',
    'pais',
    'municipio',
  ];

  async createDocente(createDocenteDto: DocentesDTO): Promise<Docentes> {
    try {
      const nuevoDocente = this.docenteRepository.create(createDocenteDto);
      return await this.docenteRepository.save(nuevoDocente);
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async getDocente(): Promise<Docentes[]> {
    try {
      return await this.docenteRepository.find({
        relations: this.defaultRelations,
      });
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
        .where('docente.id = :id', { id })
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
        .where('docente.id = :id', { id })
        .getOne();
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async editDocente(id: number, payload: DocentesDTO): Promise<Docentes> {
    try {
      const docente = await this.docenteRepository.findOne({
        where: { id },
        relations: this.defaultRelations,
      });

      if (!docente) {
        throw new NotFoundException('Docente no encontrada');
      }

      Object.assign(docente, payload);

      docente.update_at = new Date();

      return await this.docenteRepository.save(docente);
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async deleteDocente(id: number, userId: number): Promise<Docentes> {
    try {
      const docente = await this.docenteRepository.findOne({
        where: { id },
        relations: this.defaultRelations,
      });

      if (!docente) {
        throw new NotFoundException('Profesión no encontrada');
      }

      docente.deleted_at = new Date();
      docente.deleted_at_id = userId;

      return await this.docenteRepository.save(docente);
    } catch (error) {
      Utilities.catchError(error);
    }
  }
}
