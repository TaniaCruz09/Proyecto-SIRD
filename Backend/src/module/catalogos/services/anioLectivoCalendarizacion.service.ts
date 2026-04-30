import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Utilities } from '../../../common/helpers/utilities';
import { AnioLectivo } from '../entities/anioLectivo.entity';
import { AnioLectivoCalendarizacion } from '../entities/anioLectivoCalendarizacion.entity';
import { AnioLectivoCorte } from '../entities/anioLectivoCorte.entity';
import { UpsertAnioLectivoCalendarizacionDto } from '../dtos/anioLectivoCalendarizacion.dto';
import { Cortes } from '../entities/corte.entity';

@Injectable()
export class AnioLectivoCalendarizacionService {
  constructor(
    @InjectRepository(AnioLectivo)
    private readonly anioLectivoRepository: Repository<AnioLectivo>,
    @InjectRepository(AnioLectivoCorte)
    private readonly anioLectivoCorteRepository: Repository<AnioLectivoCorte>,
    @InjectRepository(AnioLectivoCalendarizacion)
    private readonly anioLectivoCalendarizacionRepository: Repository<AnioLectivoCalendarizacion>,
  ) {}

  private normalizeDate(value?: string | null): string | null {
    const normalized = typeof value === 'string' ? value.trim() : '';
    return normalized ? normalized : null;
  }

  private normalizeObservation(value?: string | null): string | null {
    const normalized = typeof value === 'string' ? value.trim() : '';
    return normalized ? normalized : null;
  }

  private async getActiveCortesForAnioLectivo(anioLectivoId: number) {
    const relations = await this.anioLectivoCorteRepository.find({
      where: { anioLectivoId },
      relations: ['corte'],
    });

    return relations
      .filter((relation) => relation.corte?.id != null && relation.corte?.delete_at == null)
      .sort((left, right) => (left.corte?.id ?? 0) - (right.corte?.id ?? 0));
  }

  async getByAnioLectivo(anioLectivoId: number) {
    try {
      const anioLectivo = await this.anioLectivoRepository.findOne({ where: { id: anioLectivoId } });

      if (!anioLectivo || anioLectivo.deleted_at) {
        throw new NotFoundException('Año lectivo no encontrado');
      }

      const [cortesRelacionados, calendarizaciones] = await Promise.all([
        this.getActiveCortesForAnioLectivo(anioLectivoId),
        this.anioLectivoCalendarizacionRepository.find({
          where: { anioLectivoId, isActive: true, delete_at: null },
          relations: ['corte'],
        }),
      ]);

      const calendarizacionMap = new Map(calendarizaciones.map((item) => [item.corteId, item]));

      return cortesRelacionados.map((relation) => {
        const existing = calendarizacionMap.get(relation.corteId);

        return {
          id: existing?.id ?? null,
          anio_lectivo_id: anioLectivoId,
          corte_id: relation.corteId,
          corte: relation.corte?.corte ?? null,
          abreviatura: relation.corte?.abreviatura ?? null,
          fecha_inicio: existing?.fecha_inicio ?? null,
          fecha_fin: existing?.fecha_fin ?? null,
          observacion: existing?.observacion ?? null,
          isActive: existing?.isActive ?? false,
        };
      });
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async upsertByAnioLectivo(
    anioLectivoId: number,
    payload: UpsertAnioLectivoCalendarizacionDto,
    userId: number,
  ) {
    try {
      const anioLectivo = await this.anioLectivoRepository.findOne({ where: { id: anioLectivoId } });

      if (!anioLectivo || anioLectivo.deleted_at) {
        throw new NotFoundException('Año lectivo no encontrado');
      }

      const cortesRelacionados = await this.getActiveCortesForAnioLectivo(anioLectivoId);
      const corteIds = cortesRelacionados.map((relation) => relation.corteId);
      const corteIdsSet = new Set(corteIds);

      const uniqueItems = Array.from(
        new Map((payload.items ?? []).map((item) => [Number(item.corte_id), item])).values(),
      );

      const invalidCorte = uniqueItems.find((item) => !corteIdsSet.has(Number(item.corte_id)));
      if (invalidCorte) {
        throw new BadRequestException('Uno o mas cortes no pertenecen al año lectivo');
      }

      const existingRows = corteIds.length > 0
        ? await this.anioLectivoCalendarizacionRepository.find({
            where: { anioLectivoId, corteId: In(corteIds) },
          })
        : [];
      const existingMap = new Map(existingRows.map((item) => [item.corteId, item]));

      const rowsToSave = uniqueItems.map((item) => {
        const fechaInicio = this.normalizeDate(item.fecha_inicio);
        const fechaFin = this.normalizeDate(item.fecha_fin);

        if ((fechaInicio && !fechaFin) || (!fechaInicio && fechaFin)) {
          throw new BadRequestException('Debes completar fecha de inicio y fecha de fin para cada corte');
        }

        if (fechaInicio && fechaFin && fechaInicio > fechaFin) {
          throw new BadRequestException('La fecha de inicio no puede ser mayor que la fecha de fin');
        }

        const existing = existingMap.get(Number(item.corte_id));

        if (existing) {
          existing.fecha_inicio = fechaInicio;
          existing.fecha_fin = fechaFin;
          existing.observacion = this.normalizeObservation(item.observacion);
          existing.isActive = Boolean(fechaInicio && fechaFin);
          existing.user_update_id = userId;
          existing.update_at = new Date();
          existing.delete_at = null;
          existing.deleted_at_id = null;
          return existing;
        }

        return this.anioLectivoCalendarizacionRepository.create({
          anioLectivo: { id: anioLectivoId } as AnioLectivo,
          corte: { id: Number(item.corte_id) } as Cortes,
          anioLectivoId,
          corteId: Number(item.corte_id),
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          observacion: this.normalizeObservation(item.observacion),
          isActive: Boolean(fechaInicio && fechaFin),
          user_create_id: userId,
        });
      });

      if (rowsToSave.length > 0) {
        await this.anioLectivoCalendarizacionRepository.save(rowsToSave);
      }

      return await this.getByAnioLectivo(anioLectivoId);
    } catch (error) {
      Utilities.catchError(error);
    }
  }
}