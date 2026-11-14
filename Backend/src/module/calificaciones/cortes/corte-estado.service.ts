import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import * as moment from 'moment-timezone';
import { AnioLectivoCalendarizacion } from '../../catalogos/entities/anioLectivoCalendarizacion.entity';
import { EsquelaHeadEntity } from '../esquela_head/entities/squela_head.entity';
import { EsquelaRow } from '../esquelas_rows/esquelas_rows.entity';
import { buildCortesFuente, buildPeriodosFuente } from './corte-secuencia';
import {
  CorteEstado,
  evaluarFechaCorte,
  formatearFechaCorte,
  mensajeEstadoCorte,
} from './corte-estado.helper';

export type { CorteEstado } from './corte-estado.helper';

export type CorteEstadoAsignatura = {
  /** Todos los estudiantes activos tienen nota en este corte */
  completo: boolean;
  /** El corte anterior ya está completo o cerrado por fecha */
  secuenciaCompleta: boolean;
  habilitado: boolean;
  editable: boolean;
  mensaje: string;
};

export type CorteEstadoItem = {
  corteId: number;
  nombre: string;
  abreviatura: string | null;
  orden: number;
  estado: CorteEstado;
  fechaInicio: string | null;
  fechaFin: string | null;
  rango: string;
  /** El backend acepta notas en esta fecha (sin contar la secuencia) */
  editablePorFecha: boolean;
  mensajeFecha: string;
  porAsignatura: Record<string, CorteEstadoAsignatura>;
};

export type CortesEstado = {
  anioActivo: boolean;
  modalidadId: number | null;
  hoy: string;
  cortes: CorteEstadoItem[];
};

const TZ = 'America/Managua';

/**
 * Estado de cada corte según las mismas reglas (y la misma zona horaria) que
 * aplica el backend al guardar notas, para que el frontend no las recalcule
 * con la hora local del navegador.
 */
@Injectable()
export class CorteEstadoService {
  constructor(
    @InjectRepository(AnioLectivoCalendarizacion)
    private readonly calendarizacionRepo: Repository<AnioLectivoCalendarizacion>,
    @InjectRepository(EsquelaRow)
    private readonly calificacionRepo: Repository<EsquelaRow>,
  ) {}

  async estadoDeEsquela(head: EsquelaHeadEntity): Promise<CortesEstado> {
    const organizacion = head?.grupo_asignatura?.organizacionEscolar;
    const anio = organizacion?.anio_lectivo;
    const anioLectivoId = Number(anio?.id ?? 0) || null;
    const modalidadId = Number(organizacion?.turno?.modalidad?.id ?? 0) || null;
    const anioActivo = this.parseBoolean(anio?.isActive);
    // moment.tz(...) evita depender de que el import de namespace sea invocable.
    const hoy = moment.tz(TZ).format('YYYY-MM-DD');

    const periodos = buildPeriodosFuente(anio);
    const filasEsquela: any[] = Array.isArray(head?.esquelaRow)
      ? head.esquelaRow
      : head?.esquelaRow
        ? [head.esquelaRow]
        : [];
    const cortes = buildCortesFuente(
      anio,
      periodos,
      filasEsquela.map((fila) => fila.corte),
    );

    const calendario =
      anioLectivoId && modalidadId
        ? await this.calendarizacionRepo.find({
            where: {
              anioLectivoId,
              modalidadId,
              delete_at: IsNull(),
            },
          })
        : [];

    const calendarioPorCorte = new Map(
      calendario.map((item) => [Number(item.corteId), item]),
    );

    const estudiantesPorAsignatura = this.estudiantesPorAsignatura(head);
    const calificados = await this.calificadosPorAsignaturaYCorte(head.id);

    const completo = (asignaturaId: number, corteId: number): boolean => {
      const estudiantes = estudiantesPorAsignatura.get(asignaturaId) ?? [];
      if (estudiantes.length === 0) return true;

      const calificadosCorte = calificados.get(`${asignaturaId}-${corteId}`);
      if (!calificadosCorte) return false;

      return estudiantes.every((id) => calificadosCorte.has(id));
    };

    const cerradoPorFecha = (corteId: number): boolean => {
      const item = calendarioPorCorte.get(corteId);
      if (!item?.fecha_fin || !this.parseBoolean(item.isActive)) return false;
      return hoy > item.fecha_fin;
    };

    const cortesEstado = cortes.map((corte, index) => {
      const item = calendarioPorCorte.get(Number(corte.id));
      const habilitadoCalendario = item ? this.parseBoolean(item.isActive) : false;
      const fechaInicio = item?.fecha_inicio ?? null;
      const fechaFin = item?.fecha_fin ?? null;
      const { estado, editablePorFecha, mensajeFecha } = evaluarFechaCorte(
        habilitadoCalendario ? fechaInicio : null,
        habilitadoCalendario ? fechaFin : null,
        hoy,
        habilitadoCalendario,
      );
      const corteAnterior = index > 0 ? cortes[index - 1] : null;

      const porAsignatura: Record<string, CorteEstadoAsignatura> = {};
      for (const asignaturaId of estudiantesPorAsignatura.keys()) {
        const completoCorte = completo(asignaturaId, corte.id);
        const secuenciaCompleta = corteAnterior
          ? completo(asignaturaId, corteAnterior.id) ||
            cerradoPorFecha(Number(corteAnterior.id))
          : true;

        const habilitado = !anioActivo
          ? true
          : secuenciaCompleta &&
            estado !== 'closed' &&
            estado !== 'unconfigured';
        const editable = !anioActivo
          ? false
          : editablePorFecha && secuenciaCompleta;

        porAsignatura[String(asignaturaId)] = {
          completo: completoCorte,
          secuenciaCompleta,
          habilitado,
          editable,
          mensaje: mensajeEstadoCorte({
            anioActivo,
            estado,
            mensajeFecha,
            secuenciaCompleta,
            completo: completoCorte,
          }),
        };
      }

      return {
        corteId: Number(corte.id),
        nombre: (corte.corte ?? '').trim(),
        abreviatura: corte.abreviatura?.trim() || null,
        orden: Number(corte.orden ?? index + 1),
        estado,
        fechaInicio,
        fechaFin,
        rango:
          fechaInicio && fechaFin
            ? `${formatearFechaCorte(fechaInicio)} - ${formatearFechaCorte(fechaFin)}`
            : 'Sin fechas',
        editablePorFecha,
        mensajeFecha,
        porAsignatura,
      };
    });

    return { anioActivo, modalidadId, hoy, cortes: cortesEstado };
  }

  private estudiantesPorAsignatura(head: EsquelaHeadEntity): Map<number, number[]> {
    const resultado = new Map<number, number[]>();
    const asignaciones = head?.grupo_asignatura?.grupoAsignaturaDocente ?? [];

    for (const asignacion of asignaciones) {
      const asignaturaId = Number(asignacion?.asignatura?.id ?? 0);
      if (!asignaturaId) continue;

      const activos = (asignacion.gruposConEstudiantes ?? [])
        .filter((relacion) => relacion?.activo !== false && relacion?.estudiante?.id)
        .map((relacion) => Number(relacion.estudiante.id));

      const previos = resultado.get(asignaturaId) ?? [];
      resultado.set(asignaturaId, [...new Set([...previos, ...activos])]);
    }

    return resultado;
  }

  private async calificadosPorAsignaturaYCorte(
    esquelaHeadId: number,
  ): Promise<Map<string, Set<number>>> {
    const filas = await this.calificacionRepo.find({
      where: { esquelaHead: { id: esquelaHeadId }, deleted_at: IsNull() },
      relations: ['estudiante', 'asignatura', 'corte'],
    });

    const resultado = new Map<string, Set<number>>();
    for (const fila of filas) {
      const asignaturaId = Number(fila.asignatura?.id ?? 0);
      const corteId = Number(fila.corte?.id ?? 0);
      const estudianteId = Number(fila.estudiante?.id ?? 0);
      if (!asignaturaId || !corteId || !estudianteId) continue;

      const clave = `${asignaturaId}-${corteId}`;
      const conjunto = resultado.get(clave) ?? new Set<number>();
      conjunto.add(estudianteId);
      resultado.set(clave, conjunto);
    }

    return resultado;
  }

  private parseBoolean(value: unknown): boolean {
    return value === true || value === 'true' || value === 't' || value === 1 || value === '1';
  }
}
