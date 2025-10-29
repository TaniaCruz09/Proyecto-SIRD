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
  ) { }

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
        .leftJoinAndSelect('docente.grupoAsignaturaDocente', 'grupoAsignaturaDocente')
        .where('docente.id = :id', { id })
        .getOne()
      return docente;
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async editDocente(id: number, payload: UpdateDocentesDTO): Promise<Docentes> {
  try {
    const docente = await this.docenteRepository.findOne({ where: { id } });
    if (!docente) {
      throw new NotFoundException('Docente no encontrado');
    }

    delete (payload as any).id;
    // Object.assign(docente, payload);

     // Actualiza los campos directamente
    await this.docenteRepository.update(id, {
      ...payload,
      update_at: new Date(),
      user_update_id: payload.user_update_id,
    });

    // docente.update_at = new Date();
    // docente.user_update_id = payload.user_update_id; // ✅ faltaba esta línea

    return await this.docenteRepository.findOne({ where: { id } });
  } catch (error) {
    console.error(error); // 🔍 para ver el error real
    throw error;
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
