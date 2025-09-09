import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Docentes } from './docentes.entity';
import { Repository } from 'typeorm';
import { DocentesDTO } from './docentes.dto';
import { Utilities } from '../../common/helpers/utilities';
import { UpdateDocentesDTO } from './updateDocentedto';

@Injectable()
export class DocentesService {
  constructor(
    @InjectRepository(Docentes)
    private readonly docenteRepository: Repository<Docentes>,
  ) {}

  async createDocente(createDocenteDto: DocentesDTO): Promise<Docentes> {
    try {
      const nuevoDocente = await this.docenteRepository.create(
        createDocenteDto,
      );
      return this.docenteRepository.save(nuevoDocente);
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async getDocenteByUserId(userId: number): Promise<Docentes> {
  try {
    const docente = await this.docenteRepository.findOne({
      where: { user_create_id: userId },
      relations: ['sexo', 'nivel_academico', 'profession', 'pais', 'municipio', 'User'],
    });

    if (!docente) {
      throw new NotFoundException('Docente no encontrado');
    }

    return docente;
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
      return docente;
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async editDocente(id: number, payload: UpdateDocentesDTO): Promise<Docentes> {
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
