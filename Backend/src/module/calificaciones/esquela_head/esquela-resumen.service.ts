import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EsquelaHeadEntity } from './entities/squela_head.entity';
import { NotaCualitativaService } from '../nota-cualitativa/nota-cualitativa.service';
import { calcularPromedios, promedio, periodosDeTrabajo } from '../promedios/promedios.helper';
import {
  buildCortesFuente,
  buildPeriodosFuente,
  CorteFuente,
  PeriodoFuente,
  sortCortes,
  uniqueCortes,
} from '../cortes/corte-secuencia';

export interface NotaCalculada {
  cuant: number;
  cual: string;
  cualitativaId: number | null;
}

export interface CorteCalificado extends NotaCalculada {
  corteId: number;
  registrado: boolean;
}

export interface PeriodoCalificado extends NotaCalculada {
  periodoId: number;
  nombre: string;
  orden: number;
  cortes: number[];
}

export interface AsignaturaCalificada {
  asignaturaId: number;
  asignatura: string;
  docente: string | null;
  cortes: CorteCalificado[];
  periodos: PeriodoCalificado[];
  final: NotaCalculada;
}

export interface EstudianteCalificado {
  id: number;
  name: string;
  lastName: string;
  studentCode: string;
  profileImage: string | null;
  gender: string | null;
  activoEnGrupo: boolean;
  asignaturas: AsignaturaCalificada[];
  promedioGeneral: NotaCalculada;
}

export interface EsquelaResumen {
  esquelaHeadId: number;
  grupo: {
    id: number | null;
    grado: string | null;
    seccion: string | null;
    turno: string | null;
    modalidad: string | null;
    anioLectivo: number | null;
    docenteGuia: string | null;
  };
  cortes: {
    id: number;
    corte: string | null;
    abreviatura: string | null;
    orden: number;
  }[];
  periodos: { id: number; nombre: string; orden: number; cortes: number[] }[];
  asignaturas: { id: number; asignatura: string; docente: string | null }[];
  estudiantes: EstudianteCalificado[];
}

/**
 * Calcula en el servidor las notas y promedios de una esquela para que el
 * frontend no replique las reglas en cada vista.
 *
 * Reglas (idénticas a la esquela actual):
 * - Corte sin nota cuenta como 0.
 * - Promedio de periodo = redondeo del promedio de sus cortes.
 * - Nota final = redondeo del promedio de los periodos.
 * - Cualitativa = primer rango del catálogo que contiene el valor.
 */
@Injectable()
export class EsquelaResumenService {
  constructor(
    @InjectRepository(EsquelaHeadEntity)
    private readonly esquelaHeadRepository: Repository<EsquelaHeadEntity>,
    private readonly notaCualitativaService: NotaCualitativaService,
  ) {}

  async build(esquelaHeadId: number): Promise<EsquelaResumen> {
    const head = await this.loadHead(esquelaHeadId);
    if (!head) {
      throw new NotFoundException('Esquela no encontrada');
    }

    const grupo = head.grupo_asignatura;
    const anio = grupo?.organizacionEscolar?.anio_lectivo;
    const filas: any[] = Array.isArray(head.esquelaRow)
      ? head.esquelaRow
      : head.esquelaRow
        ? [head.esquelaRow]
        : [];
    const rangos = await this.notaCualitativaService.getRangos();
    const cualificar = (valor: number) =>
      this.notaCualitativaService.cualificar(valor, rangos);

    let periodos = buildPeriodosFuente(anio);
    let cortes = buildCortesFuente(anio, periodos, filas.map((fila) => fila.corte));

    if (cortes.length === 0) {
      cortes = sortCortes(uniqueCortes(filas.map((fila) => fila.corte)));
    }
    if (periodos.length === 0 && cortes.length > 0) {
      periodos = [{ id: 1, nombre: 'Período único', orden: 1, cortes }];
    }

    const notasPorClave = new Map<string, any>();
    for (const fila of filas) {
      if (fila?.estudiante?.id && fila?.asignatura?.id && fila?.corte?.id) {
        notasPorClave.set(
          `${fila.estudiante.id}-${fila.asignatura.id}-${fila.corte.id}`,
          fila,
        );
      }
    }

    const asignaciones = (grupo?.grupoAsignaturaDocente ?? []) as any[];

    const estudiantes = new Map<number, any>();
    for (const asignacion of asignaciones) {
      for (const relacion of asignacion.gruposConEstudiantes ?? []) {
        const estudiante = relacion.estudiante;
        if (!estudiante?.id) continue;

        const existente = estudiantes.get(estudiante.id);
        if (!existente) {
          estudiantes.set(estudiante.id, {
            id: estudiante.id,
            name: estudiante.name ?? '',
            lastName: estudiante.lastName ?? '',
            studentCode: estudiante.studentCode ?? '',
            profileImage: estudiante.profileImage ?? null,
            gender: estudiante.gender?.gender ?? null,
            activoEnGrupo: relacion.activo !== false,
          });
        } else if (relacion.activo !== false) {
          existente.activoEnGrupo = true;
        }
      }
    }

    const estudiantesCalificados: EstudianteCalificado[] = [
      ...estudiantes.values(),
    ].map((estudiante) => {
      const asignaturas = asignaciones
        .filter((asignacion) => asignacion?.asignatura?.id)
        .map((asignacion) =>
          this.buildAsignatura(
            estudiante.id,
            asignacion,
            cortes,
            periodos,
            notasPorClave,
            cualificar,
          ),
        );

      const promedioGeneral = promedio(
        asignaturas.map((asignatura) => asignatura.final.cuant),
      );

      return {
        ...estudiante,
        asignaturas,
        promedioGeneral: {
          cuant: promedioGeneral,
          ...cualificar(promedioGeneral),
        },
      };
    });

    return {
      esquelaHeadId: head.id,
      grupo: {
        id: grupo?.id ?? null,
        grado: grupo?.grado?.grades ?? null,
        seccion: grupo?.seccion?.seccion ?? null,
        turno: grupo?.organizacionEscolar?.turno?.turno ?? null,
        modalidad:
          grupo?.organizacionEscolar?.turno?.modalidad?.modalidad ?? null,
        anioLectivo: anio?.anio_lectivo ?? null,
        docenteGuia: this.nombreDocente(grupo?.docenteGuia),
      },
      cortes: cortes.map((corte, index) => ({
        id: corte.id,
        corte: corte.corte ?? null,
        abreviatura: corte.abreviatura ?? null,
        orden: corte.orden ?? index + 1,
      })),
      periodos: periodos.map((periodo) => ({
        id: periodo.id,
        nombre: periodo.nombre,
        orden: periodo.orden,
        cortes: periodo.cortes.map((corte) => corte.id),
      })),
      asignaturas: this.uniqueAsignaturas(asignaciones),
      estudiantes: estudiantesCalificados,
    };
  }

  private buildAsignatura(
    estudianteId: number,
    asignacion: any,
    cortes: CorteFuente[],
    periodos: PeriodoFuente[],
    notasPorClave: Map<string, any>,
    cualificar: (valor: number) => { cual: string; cualitativaId: number | null },
  ): AsignaturaCalificada {
    const asignaturaId = asignacion.asignatura.id;

    const cortesCalificados: CorteCalificado[] = cortes.map((corte) => {
      const fila = notasPorClave.get(
        `${estudianteId}-${asignaturaId}-${corte.id}`,
      );
      const cuant = fila?.notaCuantitativa ?? 0;

      return {
        corteId: corte.id,
        registrado: Boolean(fila),
        cuant,
        ...cualificar(cuant),
      };
    });

    const porCorte = new Map(
      cortesCalificados.map((corte) => [corte.corteId, corte.cuant]),
    );

    const filaDeCorte = (corteId: number) =>
      notasPorClave.get(`${estudianteId}-${asignaturaId}-${corteId}`);

    const calculado = calcularPromedios(
      cortes,
      periodosDeTrabajo(periodos, cortes),
      (corteId) => porCorte.get(corteId) ?? 0,
    );

    // Se prefiere el valor persistido en la fila; si no existe, se calcula.
    const periodosCalificados: PeriodoCalificado[] = periodos.map((periodo) => {
      const persistido = periodo.cortes
        .map((corte) => filaDeCorte(corte.id)?.promedio_semestral)
        .find((valor) => valor != null);
      const cuant =
        persistido ?? calculado.porPeriodo.get(periodo.id) ?? 0;

      return {
        periodoId: periodo.id,
        nombre: periodo.nombre,
        orden: periodo.orden,
        cortes: periodo.cortes.map((corte) => corte.id),
        cuant,
        ...cualificar(cuant),
      };
    });

    const finalPersistido = cortes
      .map((corte) => filaDeCorte(corte.id)?.nota_final)
      .find((valor) => valor != null);
    const finalCuant = finalPersistido ?? calculado.final;

    return {
      asignaturaId,
      asignatura: asignacion.asignatura?.asignatura ?? '',
      docente: this.nombreDocente(asignacion.docente),
      cortes: cortesCalificados,
      periodos: periodosCalificados,
      final: { cuant: finalCuant, ...cualificar(finalCuant) },
    };
  }

  private uniqueAsignaturas(asignaciones: any[]) {
    const unicas = new Map<
      number,
      { id: number; asignatura: string; docente: string | null }
    >();

    for (const asignacion of asignaciones) {
      const id = asignacion?.asignatura?.id;
      if (!id || unicas.has(id)) continue;
      unicas.set(id, {
        id,
        asignatura: asignacion.asignatura?.asignatura ?? '',
        docente: this.nombreDocente(asignacion.docente),
      });
    }

    return [...unicas.values()];
  }

  private nombreDocente(docente?: any): string | null {
    if (!docente) return null;
    const nombre = [
      docente.nombres,
      docente.apellido_paterno,
      docente.apellido_materno,
    ]
      .filter(Boolean)
      .join(' ')
      .trim();
    return nombre || null;
  }

  private isMissingPeriodoTableError(error: unknown): boolean {
    const message = (error as { message?: string })?.message ?? '';
    return (
      message.includes('catalogos.periodo_lectivo') ||
      message.includes('periodo_lectivo_corte')
    );
  }

  private buildQuery(id: number, includePeriodos: boolean) {
    const query = this.esquelaHeadRepository
      .createQueryBuilder('head')
      .leftJoinAndSelect('head.grupo_asignatura', 'grupo')
      .leftJoinAndSelect('grupo.organizacionEscolar', 'org')
      .leftJoinAndSelect('org.anio_lectivo', 'anio')
      .leftJoinAndSelect('anio.cortesAnioLectivo', 'anioCorte')
      .leftJoinAndSelect('anioCorte.corte', 'corteAnio')
      .leftJoinAndSelect('org.turno', 'turno')
      .leftJoinAndSelect('turno.modalidad', 'modalidad')
      .leftJoinAndSelect('grupo.grado', 'grado')
      .leftJoinAndSelect('grupo.seccion', 'seccion')
      .leftJoinAndSelect('grupo.docenteGuia', 'docenteGuia')
      .leftJoinAndSelect('grupo.grupoAsignaturaDocente', 'gad')
      .leftJoinAndSelect('gad.asignatura', 'asignatura')
      .leftJoinAndSelect('gad.docente', 'docente')
      .leftJoinAndSelect('gad.gruposConEstudiantes', 'gce')
      .leftJoinAndSelect('gce.estudiante', 'estudiante')
      .leftJoinAndSelect('estudiante.gender', 'gender')
      .leftJoinAndSelect('head.esquelaRow', 'row')
      .leftJoinAndSelect('row.estudiante', 'rowEstudiante')
      .leftJoinAndSelect('row.asignatura', 'rowAsignatura')
      .leftJoinAndSelect('row.corte', 'rowCorte')
      .leftJoinAndSelect('row.notaCualitativa', 'rowCualitativa')
      .where('head.id = :id', { id })
      .andWhere('head.deleted_at IS NULL');

    if (includePeriodos) {
      query
        .leftJoinAndSelect('anio.periodosLectivos', 'periodo')
        .leftJoinAndSelect('periodo.cortesPeriodo', 'periodoCorte')
        .leftJoinAndSelect('periodoCorte.corte', 'cortePeriodo');
    }

    return query;
  }

  private async loadHead(id: number): Promise<EsquelaHeadEntity | null> {
    try {
      return await this.buildQuery(id, true).getOne();
    } catch (error) {
      if (!this.isMissingPeriodoTableError(error)) throw error;
      return await this.buildQuery(id, false).getOne();
    }
  }
}
