import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoPeriodizacion } from '../entities/tipoPeriodizacion.entity';
import { CreateTipoPeriodizacionDto } from '../dtos/tipoPeriodizacion.dto';

@Injectable()
export class TipoPeriodizacionService {
  constructor(
    @InjectRepository(TipoPeriodizacion)
    private readonly tipoPeriodizacionRepository: Repository<TipoPeriodizacion>,
  ) {}

  async create(payload: CreateTipoPeriodizacionDto): Promise<TipoPeriodizacion> {
    const item = this.tipoPeriodizacionRepository.create({
      ...payload,
      nombre: payload.nombre?.trim(),
      prefijo_abreviatura: payload.prefijo_abreviatura?.trim() || null,
    });
    return await this.tipoPeriodizacionRepository.save(item);
  }

  async findOne(id: number): Promise<TipoPeriodizacion> {
    return await this.tipoPeriodizacionRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<TipoPeriodizacion[]> {
    return await this.tipoPeriodizacionRepository.find({ where: { delete_at: null } });
  }

  async update(id: number, payload: Partial<CreateTipoPeriodizacionDto>): Promise<TipoPeriodizacion> {
    const item = await this.tipoPeriodizacionRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException('Tipo de periodo no encontrado');
    }

    Object.assign(item, {
      ...payload,
      nombre: payload.nombre?.trim() ?? item.nombre,
      prefijo_abreviatura: payload.prefijo_abreviatura?.trim() || null,
    });

    item.update_at = new Date();
    return await this.tipoPeriodizacionRepository.save(item);
  }

  async delete(id: number, userId: number): Promise<TipoPeriodizacion> {
    const item = await this.tipoPeriodizacionRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException('Tipo de periodo no encontrado');
    }

    item.delete_at = new Date();
    item.delete_at_id = userId;

    return await this.tipoPeriodizacionRepository.save(item);
  }
}
