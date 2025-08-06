import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Turno } from '../entities/turnos.entity';
import { Utilities } from '../../../common/helpers/utilities';
import { CreateTurnoDto } from '../dtos/turnos.dto';

@Injectable()
export class TurnoService {
  constructor(
    @InjectRepository(Turno)
    private turnoRepository: Repository<Turno>,
  ) { }

  async create(payload: CreateTurnoDto): Promise<Turno> {
    try {
      const turno = await this.turnoRepository.create(payload);
      return await this.turnoRepository.save(turno);
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async findAll(): Promise<Turno[]> {
    try {
      const turno = await this.turnoRepository.find();
      return turno;
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async findOne(id: number): Promise<Turno> {
    try {
      const turno = await this.turnoRepository.findOne({ where: { id } });
      return turno;
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async update(id: number, payload: CreateTurnoDto): Promise<Turno> {
    try {
      const turno = await this.turnoRepository.findOne({ where: { id } });
      if (!turno) {
        throw new NotFoundException('Profesión no encontrada');
      }

      // Actualizar solo los campos enviados, conservando los valores previos
      Object.assign(turno, payload);

      // Asignar la fecha de actualización y el usuario que modifica
      turno.update_at = new Date();
      turno.user_update_id;

      return await this.turnoRepository.save(turno);
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async delete(id: number, userId: number): Promise<Turno> {
    try {
      const turno = await this.turnoRepository.findOne({ where: { id } });

      if (!turno) {
        throw new NotFoundException('Profesión no encontrada');
      }

      // Registrar el usuario que eliminó y la fecha de eliminación
      turno.deleted_at = new Date();
      turno.deleted_at_id = userId;

      return await this.turnoRepository.save(turno);
    } catch (error) {
      Utilities.catchError(error);
    }
  }
}
