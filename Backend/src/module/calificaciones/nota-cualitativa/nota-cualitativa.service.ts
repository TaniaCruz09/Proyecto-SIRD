import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { NotaCualitativa } from '../../catalogos/entities/notaCualitativa.entity';

export interface RangoCualitativo {
  id: number | null;
  abreviatura: string;
  rango_menor: number;
  rango_mayor: number;
}

export interface NotaCualificada {
  cual: string;
  cualitativaId: number | null;
}

export const ABREVIATURA_SIN_NOTA = 'AI';

/**
 * Fuente única de la regla "nota cuantitativa → nota cualitativa":
 * el primer rango del catálogo (ordenado por id) que contiene el valor.
 */
@Injectable()
export class NotaCualitativaService {
  constructor(
    @InjectRepository(NotaCualitativa)
    private readonly notaCualitativaRepo: Repository<NotaCualitativa>,
  ) {}

  async getRangos(): Promise<RangoCualitativo[]> {
    const notas = await this.notaCualitativaRepo.find({
      where: { deleted_at: IsNull() },
      order: { id: 'ASC' },
    });

    return notas
      .filter((nota) => nota.rango_menor != null && nota.rango_mayor != null)
      .map((nota) => ({
        id: nota.id ?? null,
        abreviatura: nota.abreviatura ?? ABREVIATURA_SIN_NOTA,
        rango_menor: nota.rango_menor,
        rango_mayor: nota.rango_mayor,
      }));
  }

  cualificar(valor: number, rangos: RangoCualitativo[]): NotaCualificada {
    if (!Number.isFinite(valor)) {
      return { cual: ABREVIATURA_SIN_NOTA, cualitativaId: null };
    }

    const rango = rangos.find(
      (item) => valor >= item.rango_menor && valor <= item.rango_mayor,
    );

    return rango
      ? { cual: rango.abreviatura, cualitativaId: rango.id }
      : { cual: ABREVIATURA_SIN_NOTA, cualitativaId: null };
  }

  async derivar(valor: number): Promise<NotaCualificada> {
    return this.cualificar(valor, await this.getRangos());
  }
}
