import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { EsquelaRow } from '../esquelas_rows/esquelas_rows.entity';
import { EsquelaHeadEntity } from '../esquela_head/entities/squela_head.entity';
import {
  buildCortesFuente,
  buildPeriodosFuente,
  CorteFuente,
  isMissingPeriodoTablesError,
  PeriodoFuente,
} from '../cortes/corte-secuencia';
import { calcularPromedios, periodosDeTrabajo } from './promedios.helper';

export type CortesDeEsquela = {
  cortes: CorteFuente[];
  periodos: PeriodoFuente[];
};

/**
 * Mantiene persistidos en `esquela_row` el promedio del período
 * (`promedio_semestral`) y la nota final de la asignatura (`nota_final`).
 */
@Injectable()
export class PromediosService {
  constructor(
    @InjectRepository(EsquelaRow)
    private readonly calificacionRepo: Repository<EsquelaRow>,
    @InjectRepository(EsquelaHeadEntity)
    private readonly esquelaHeadRepo: Repository<EsquelaHeadEntity>,
  ) {}

  async cortesDeEsquela(esquelaHeadId: number): Promise<CortesDeEsquela> {
    let head: EsquelaHeadEntity | null;

    try {
      head = await this.buildHeadQuery(esquelaHeadId, true).getOne();
    } catch (error) {
      if (!isMissingPeriodoTablesError(error)) throw error;
      head = await this.buildHeadQuery(esquelaHeadId, false).getOne();
    }

    const anio = head?.grupo_asignatura?.organizacionEscolar?.anio_lectivo;
    const periodos = buildPeriodosFuente(anio);
    let cortes = buildCortesFuente(anio, periodos);

    if (cortes.length === 0) {
      const filas = await this.calificacionRepo.find({
        where: { esquelaHead: { id: esquelaHeadId }, deleted_at: IsNull() },
        relations: ['corte'],
      });
      cortes = buildCortesFuente(anio, [], filas.map((fila) => fila.corte));
    }

    return { cortes, periodos };
  }

  /**
   * Recalcula y guarda los promedios de un estudiante en una asignatura.
   * Devuelve cuántas filas se actualizaron.
   */
  async recalcularAsignatura(
    esquelaHeadId: number,
    estudianteId: number,
    asignaturaId: number,
  ): Promise<number> {
    if (!esquelaHeadId || !estudianteId || !asignaturaId) return 0;

    const { cortes, periodos } = await this.cortesDeEsquela(esquelaHeadId);
    if (cortes.length === 0) return 0;

    const filas = await this.calificacionRepo.find({
      where: {
        deleted_at: IsNull(),
        esquelaHead: { id: esquelaHeadId },
        estudiante: { id: estudianteId },
        asignatura: { id: asignaturaId },
      },
      relations: ['corte'],
    });

    if (filas.length === 0) return 0;

    const valorPorCorte = new Map<number, number>();
    for (const fila of filas) {
      const corteId = Number(fila.corte?.id);
      if (corteId) valorPorCorte.set(corteId, Number(fila.notaCuantitativa ?? 0));
    }

    const periodosTrabajo = periodosDeTrabajo(periodos, cortes);
    const { porPeriodo, final } = calcularPromedios(
      cortes,
      periodosTrabajo,
      (corteId) => valorPorCorte.get(corteId) ?? 0,
    );

    const periodoDelCorte = new Map<number, number>();
    for (const periodo of periodosTrabajo) {
      for (const corte of periodo.cortes) {
        periodoDelCorte.set(corte.id, periodo.id);
      }
    }

    const cambios = filas
      .map((fila) => {
        const periodoId = periodoDelCorte.get(Number(fila.corte?.id));
        const promedioSemestral =
          periodoId != null ? porPeriodo.get(periodoId) ?? 0 : final;

        if (fila.promedio_semestral === promedioSemestral && fila.nota_final === final) {
          return null;
        }

        return { id: fila.id, promedio_semestral: promedioSemestral, nota_final: final };
      })
      .filter((cambio): cambio is { id: number; promedio_semestral: number; nota_final: number } =>
        Boolean(cambio),
      );

    if (cambios.length > 0) {
      await this.calificacionRepo.save(cambios);
    }

    return cambios.length;
  }

  /** Recalcula todas las notas de una esquela (útil al importar datos). */
  async recalcularEsquela(esquelaHeadId: number): Promise<number> {
    const filas = await this.calificacionRepo.find({
      where: { esquelaHead: { id: esquelaHeadId }, deleted_at: IsNull() },
      relations: ['estudiante', 'asignatura'],
    });

    const combinaciones = new Map<string, { estudianteId: number; asignaturaId: number }>();
    for (const fila of filas) {
      const estudianteId = Number(fila.estudiante?.id);
      const asignaturaId = Number(fila.asignatura?.id);
      if (!estudianteId || !asignaturaId) continue;
      combinaciones.set(`${estudianteId}-${asignaturaId}`, { estudianteId, asignaturaId });
    }

    let actualizados = 0;
    for (const combinacion of combinaciones.values()) {
      actualizados += await this.recalcularAsignatura(
        esquelaHeadId,
        combinacion.estudianteId,
        combinacion.asignaturaId,
      );
    }

    return actualizados;
  }

  private buildHeadQuery(esquelaHeadId: number, includePeriodos: boolean) {
    const query = this.esquelaHeadRepo
      .createQueryBuilder('head')
      .leftJoinAndSelect('head.grupo_asignatura', 'grupo')
      .leftJoinAndSelect('grupo.organizacionEscolar', 'org')
      .leftJoinAndSelect('org.anio_lectivo', 'anio')
      .leftJoinAndSelect('anio.cortesAnioLectivo', 'anioCorte')
      .leftJoinAndSelect('anioCorte.corte', 'corteAnio')
      .where('head.id = :esquelaHeadId', { esquelaHeadId })
      .andWhere('head.deleted_at IS NULL');

    if (includePeriodos) {
      query
        .leftJoinAndSelect('anio.periodosLectivos', 'periodo')
        .leftJoinAndSelect('periodo.cortesPeriodo', 'periodoCorte')
        .leftJoinAndSelect('periodoCorte.corte', 'cortePeriodo');
    }

    return query;
  }
}
