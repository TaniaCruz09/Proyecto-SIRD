import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';

import {
  AnioLectivo,
  AnioLectivoCalendarizacion,
  AnioLectivoCorte,
  GradesEntity,
  PeriodoLectivo,
  PeriodoLectivoCorte,
} from '../../catalogos';
import { StudentEntity } from '../../createEstudents/students.entity';
import { Grupos } from '../../organizacionEscolar/entities/grupos.entity';
import { OrganizacionEscolar } from '../../organizacionEscolar/entities/organizacionEscolar.entity';
import { GrupoAsignaturaDocente } from '../../organizacionEscolar/entities/GrupoAsignaturaDocente.entity';
import { GrupoAsignaturaConEstudiantes } from '../../organizacionEscolar/entities/grupo-asignatura-con-estudiantes.entity';
import { AplicarPromocionDto } from '../dtos/aplicar-promocion.dto';
import { ClonarEstructuraDto } from '../dtos/clonar-estructura.dto';
import { elegirGrupoSugerido, etiquetaGrupo } from '../promocion.helpers';
import {
  AnioLectivoResumen,
  DetallePromocion,
  EstudianteSugerido,
  GrupoConEstudiantes,
  GrupoCreado,
  GrupoOmitido,
  GrupoResumen,
  ResultadoClonado,
  ResultadoPromocion,
  SugerenciasPromocion,
} from '../interfaces/promocion.interfaces';

/**
 * Promoción de estudiantes entre años lectivos.
 *
 * Toda la lógica vive aquí: el frontend solo envía la selección y muestra el
 * resultado. El cambio de año no borra nada; las inscripciones del año anterior
 * se conservan como historial y se crean filas nuevas para el año destino.
 */
@Injectable()
export class PromocionService {
  constructor(
    @InjectRepository(AnioLectivo)
    private readonly anioRepo: Repository<AnioLectivo>,

    @InjectRepository(OrganizacionEscolar)
    private readonly orgRepo: Repository<OrganizacionEscolar>,

    @InjectRepository(Grupos)
    private readonly grupoRepo: Repository<Grupos>,

    @InjectRepository(GrupoAsignaturaConEstudiantes)
    private readonly inscripcionRepo: Repository<GrupoAsignaturaConEstudiantes>,

    @InjectRepository(PeriodoLectivo)
    private readonly periodoRepo: Repository<PeriodoLectivo>,

    @InjectRepository(AnioLectivoCorte)
    private readonly anioCorteRepo: Repository<AnioLectivoCorte>,

    @InjectRepository(AnioLectivoCalendarizacion)
    private readonly calendarizacionRepo: Repository<AnioLectivoCalendarizacion>,

    private readonly dataSource: DataSource,
  ) {}

  /** Años lectivos disponibles para elegir origen y destino. */
  async listarAniosLectivos(): Promise<AnioLectivoResumen[]> {
    const [anios, conteos] = await Promise.all([
      this.anioRepo.find({ order: { anio_lectivo: 'DESC' } }),
      this.grupoRepo
        .createQueryBuilder('grupo')
        .innerJoin('grupo.organizacionEscolar', 'org')
        .innerJoin('org.anio_lectivo', 'anio')
        .select('anio.id', 'anioId')
        .addSelect('count(grupo.id)', 'total')
        .where('grupo.deleted_at IS NULL')
        .groupBy('anio.id')
        .getRawMany<{ anioId: number; total: string }>(),
    ]);

    const totalPorAnio = new Map(
      conteos.map((fila) => [Number(fila.anioId), Number(fila.total)]),
    );

    return anios.map((anio) => ({
      id: anio.id,
      anioLectivo: anio.anio_lectivo,
      isActive: anio.isActive,
      grupos: totalPorAnio.get(anio.id) ?? 0,
    }));
  }

  /** Grupos de un año lectivo con el total de estudiantes inscritos. */
  async listarGrupos(anioLectivoId: number): Promise<GrupoConEstudiantes[]> {
    const grupos = await this.cargarGrupos(anioLectivoId);
    if (grupos.length === 0) return [];

    const anioActual = await this.anioRepo.findOne({
      where: { id: anioLectivoId },
    });
    const numeroAnio = anioActual?.anio_lectivo ?? 0;

    // Total de estudiantes del grupo y cuántos siguen pendientes de promover.
    // Pendiente = sigue activo en el grupo y todavía no tiene inscripción en
    // otro año lectivo (ni fue marcado como "no continúa").
    const conteos: { grupoId: number; total: string; pendientes: string }[] =
      await this.inscripcionRepo.query(
        `SELECT g.id AS "grupoId",
                COUNT(DISTINCT gce."estudianteId")::int AS "total",
                COUNT(DISTINCT CASE
                  WHEN gce.activo AND NOT EXISTS (
                    SELECT 1
                      FROM organizacion_escolar.grupo_asignatura_con_estudiantes otra
                      JOIN organizacion_escolar.grupo_asignatura_docente gad2
                        ON gad2.id = otra."grupoAsignaturaDocenteId"
                      JOIN organizacion_escolar.grupos g2
                        ON g2.id = gad2.grupo_id
                      JOIN organizacion_escolar."organizacionEscolar" o2
                        ON o2.id = g2."organizacionEscolarId"
                      JOIN catalogos."anioLectivo" a2
                        ON a2.id = o2."anioLectivo_id"
                     WHERE otra."estudianteId" = gce."estudianteId"
                       AND otra.deleted_at IS NULL
                       AND a2.anio_lectivo > $2
                  )
                  THEN gce."estudianteId"
                END)::int AS "pendientes"
           FROM organizacion_escolar.grupos g
           JOIN organizacion_escolar.grupo_asignatura_docente gad
             ON gad.grupo_id = g.id
           JOIN organizacion_escolar.grupo_asignatura_con_estudiantes gce
             ON gce."grupoAsignaturaDocenteId" = gad.id
            AND gce.deleted_at IS NULL
          WHERE g.id = ANY($1::int[])
          GROUP BY g.id`,
        [grupos.map((g) => g.id), numeroAnio],
      );

    const conteoPorGrupo = new Map(
      conteos.map((fila) => [
        Number(fila.grupoId),
        { total: Number(fila.total), pendientes: Number(fila.pendientes) },
      ]),
    );

    const disponibles: GrupoConEstudiantes[] = [];

    for (const grupo of grupos) {
      const conteo = conteoPorGrupo.get(grupo.id) ?? { total: 0, pendientes: 0 };

      // Sin estudiantes pendientes el grupo ya se terminó de promover (todos
      // pasaron de año o quedaron como "no continúa"): no vuelve a ofrecerse.
      if (conteo.pendientes === 0) continue;

      disponibles.push({ ...grupo, estudiantes: conteo.total });
    }

    return disponibles;
  }

  /**
   * Estudiantes del grupo de origen con el destino ya propuesto: el grupo del
   * grado siguiente que tenga la misma sección (Séptimo A -> Octavo A).
   */
  async obtenerSugerencias(
    grupoOrigenId: number,
    anioDestinoId: number,
  ): Promise<SugerenciasPromocion> {
    const grupoOrigen = await this.cargarGrupo(grupoOrigenId);
    const anioDestino = await this.anioRepo.findOne({
      where: { id: anioDestinoId },
    });

    if (!anioDestino) {
      throw new NotFoundException('El año lectivo destino no existe');
    }

    const ordenOrigen = grupoOrigen.ordenGrado;
    if (ordenOrigen === null) {
      throw new BadRequestException(
        `El grado "${grupoOrigen.grado ?? 'sin grado'}" no tiene una secuencia configurada; no se puede calcular el grado siguiente.`,
      );
    }

    const [estudiantes, gruposDestino] = await Promise.all([
      this.listarEstudiantesDeGrupo(grupoOrigenId),
      this.cargarGrupos(anioDestinoId),
    ]);

    const gruposDisponibles = gruposDestino.filter(
      (grupo) => grupo.ordenGrado === ordenOrigen + 1,
    );
    const gruposRepeticion = gruposDestino.filter(
      (grupo) => grupo.ordenGrado === ordenOrigen,
    );

    const sugerido = elegirGrupoSugerido(
      gruposDisponibles,
      grupoOrigen.seccionId,
    );

    return {
      grupoOrigen: {
        ...grupoOrigen,
        estudiantes: estudiantes.length,
      },
      anioDestino: {
        id: anioDestino.id,
        anioLectivo: anioDestino.anio_lectivo,
      },
      estudiantes: estudiantes.map<EstudianteSugerido>((estudiante) => ({
        id: estudiante.id,
        nombre: estudiante.nombre,
        codigo: estudiante.codigo,
        destinoSugeridoId: sugerido?.id ?? null,
        destinoSugeridoLabel: sugerido?.label ?? null,
      })),
      gruposDisponibles,
      gruposRepeticion,
    };
  }

  /**
   * Crea un año lectivo nuevo copiando la estructura del año anterior:
   * organización por turno, grupos con el grado siguiente y mismas secciones,
   * y las materias de cada grupo (sin docentes, que se asignan después).
   */
  async clonarEstructura(
    dto: ClonarEstructuraDto,
    userId?: number,
  ): Promise<ResultadoClonado> {
    const origen = await this.anioRepo.findOne({
      where: { id: dto.anioOrigenId },
    });
    if (!origen) {
      throw new NotFoundException('El año lectivo de origen no existe');
    }

    const yaExiste = await this.anioRepo.findOne({
      where: { anio_lectivo: dto.anioDestino },
    });
    if (yaExiste) {
      throw new ConflictException(
        `El año lectivo ${dto.anioDestino} ya existe. Elige otro año.`,
      );
    }

    const [
      organizaciones,
      gruposOrigen,
      periodosOrigen,
      cortesOrigen,
      calendarizacionOrigen,
    ] = await Promise.all([
      this.orgRepo.find({
        where: { anio_lectivo: { id: origen.id } },
        relations: { turno: { modalidad: true } },
      }),
      this.grupoRepo
        .createQueryBuilder('grupo')
        .leftJoinAndSelect('grupo.grado', 'grado')
        .leftJoinAndSelect('grupo.seccion', 'seccion')
        .leftJoinAndSelect('grupo.organizacionEscolar', 'org')
        .leftJoinAndSelect('org.turno', 'turno')
        .leftJoinAndSelect('turno.modalidad', 'modalidad')
        .leftJoinAndSelect('grupo.grupoAsignaturaDocente', 'asignacion')
        .leftJoinAndSelect('asignacion.asignatura', 'asignatura')
        .innerJoin('org.anio_lectivo', 'anio')
        .where('anio.id = :anioOrigenId', { anioOrigenId: origen.id })
        .andWhere('grupo.deleted_at IS NULL')
        .orderBy('grado.orden', 'ASC')
        .addOrderBy('seccion.seccion', 'ASC')
        .getMany(),
      this.periodoRepo.find({
        where: { anioLectivoId: origen.id },
        relations: { cortesPeriodo: true },
        order: { orden: 'ASC' },
      }),
      this.anioCorteRepo.find({ where: { anioLectivoId: origen.id } }),
      this.calendarizacionRepo.find({ where: { anioLectivoId: origen.id } }),
    ]);

    if (organizaciones.length === 0) {
      throw new BadRequestException(
        'El año de origen no tiene organización escolar configurada.',
      );
    }
    if (gruposOrigen.length === 0) {
      throw new BadRequestException('El año de origen no tiene grupos creados.');
    }

    const gruposCreados: GrupoCreado[] = [];
    const gruposOmitidos: GrupoOmitido[] = [];

    const cortesDelAnio = new Set<number>();
    for (const periodo of periodosOrigen) {
      for (const enlace of periodo.cortesPeriodo ?? []) {
        cortesDelAnio.add(enlace.corteId);
      }
    }
    for (const corte of cortesOrigen) {
      cortesDelAnio.add(corte.corteId);
    }

    const anioLectivoId = await this.dataSource.transaction(async (manager) => {
      const anio = await manager.save(
        manager.create(AnioLectivo, {
          anio_lectivo: dto.anioDestino,
          isActive: false,
          user_create_id: userId,
        }),
      );

      const organizacionPorTurno = new Map<number, OrganizacionEscolar>();
      for (const organizacion of organizaciones) {
        const nueva = await manager.save(
          manager.create(OrganizacionEscolar, {
            anio_lectivo: anio,
            turno: organizacion.turno,
            user_create_id: userId,
          }),
        );
        organizacionPorTurno.set(organizacion.turno?.id ?? 0, nueva);
      }

      // Periodización y cortes: sin esto el año nuevo no puede registrar notas.
      for (const periodo of periodosOrigen) {
        const nuevoPeriodo = await manager.save(
          manager.create(PeriodoLectivo, {
            anioLectivoId: anio.id,
            nombre: periodo.nombre,
            abreviatura: periodo.abreviatura,
            tipo: periodo.tipo,
            tipoPeriodizacionId: periodo.tipoPeriodizacionId,
            orden: periodo.orden,
          }),
        );

        const cortesDelPeriodo = periodo.cortesPeriodo ?? [];
        if (cortesDelPeriodo.length > 0) {
          await manager.insert(
            PeriodoLectivoCorte,
            cortesDelPeriodo.map((enlace) => ({
              periodoLectivoId: nuevoPeriodo.id,
              corteId: enlace.corteId,
              orden: enlace.orden ?? null,
            })),
          );
        }
      }

      if (cortesOrigen.length > 0) {
        await manager.insert(
          AnioLectivoCorte,
          cortesOrigen.map((corte) => ({
            anioLectivoId: anio.id,
            corteId: corte.corteId,
          })),
        );
      }

      // Calendarización: mismos cortes y modalidades, fechas vacías para el año nuevo.
      if (calendarizacionOrigen.length > 0) {
        await manager.insert(
          AnioLectivoCalendarizacion,
          calendarizacionOrigen.map((fila) => ({
            anioLectivoId: anio.id,
            corteId: fila.corteId,
            modalidadId: fila.modalidadId,
            fecha_inicio: null,
            fecha_fin: null,
            observacion: fila.observacion ?? null,
            isActive: false,
            user_create_id: userId,
          })),
        );
      }

      const clavesCreadas = new Set<string>();

      const crearGrupo = async (
        grupoOrigen: Grupos,
        grado: GradesEntity,
        organizacion: OrganizacionEscolar,
      ) => {
        // La clave incluye la organización: un mismo grado+sección puede existir
        // en varias (matutino y sabatino, por ejemplo) y todas se deben copiar.
        const clave = `${organizacion.id}-${grado.id}-${grupoOrigen.seccion?.id}`;
        if (clavesCreadas.has(clave)) return;
        clavesCreadas.add(clave);

        const nuevoGrupo = await manager.save(
          manager.create(Grupos, {
            grado,
            seccion: grupoOrigen.seccion,
            organizacionEscolar: organizacion,
            docenteGuia: null,
            user_create_id: userId,
          }),
        );

        const materias = grupoOrigen.grupoAsignaturaDocente ?? [];
        if (materias.length > 0) {
          await manager.save(
            materias.map((materia) =>
              manager.create(GrupoAsignaturaDocente, {
                grupo: nuevoGrupo,
                asignatura: materia.asignatura,
                docente: null,
                activo: true,
                user_update_id: userId,
              }),
            ),
          );
        }

        gruposCreados.push({
          id: nuevoGrupo.id,
          label: etiquetaGrupo(
            grado.grades,
            grupoOrigen.seccion?.seccion,
            organizacion.turno?.turno,
            organizacion.turno?.modalidad?.modalidad,
          ),
        });
      };

      for (const grupo of gruposOrigen) {
        const label = etiquetaGrupo(
          grupo.grado?.grades,
          grupo.seccion?.seccion,
          grupo.organizacionEscolar?.turno?.turno,
          grupo.organizacionEscolar?.turno?.modalidad?.modalidad,
        );

        if (!grupo.grado || !grupo.seccion) {
          gruposOmitidos.push({
            label,
            motivo: 'El grupo no tiene grado o sección asignados',
          });
          continue;
        }

        const organizacion =
          organizacionPorTurno.get(grupo.organizacionEscolar?.turno?.id ?? -1) ??
          (organizaciones.length === 1
            ? [...organizacionPorTurno.values()][0]
            : undefined);

        if (!organizacion) {
          gruposOmitidos.push({
            label,
            motivo: 'No se encontró la organización del turno en el año nuevo',
          });
          continue;
        }

        // 1) Copia exacta del grupo del año anterior.
        await crearGrupo(grupo, grupo.grado, organizacion);
      }

      return anio.id;
    });

    return {
      anioLectivoId,
      anioLectivo: dto.anioDestino,
      organizacionesCreadas: organizaciones.length,
      periodosCopiados: periodosOrigen.length,
      cortesCopiados: cortesDelAnio.size,
      gruposCreados,
      gruposOmitidos,
    };
  }

  /**
   * Inscribe a los estudiantes en los grupos destino. Todo ocurre en una sola
   * transacción: si un estudiante falla, no se guarda ninguno.
   */
  async aplicarPromocion(
    dto: AplicarPromocionDto,
    userId?: number,
  ): Promise<ResultadoPromocion> {
    const grupoOrigen = await this.grupoRepo.findOne({
      where: { id: dto.grupoOrigenId },
    });
    if (!grupoOrigen) {
      throw new NotFoundException('El grupo de origen no existe');
    }

    const anioDestino = await this.anioRepo.findOne({
      where: { id: dto.anioDestinoId },
    });
    if (!anioDestino) {
      throw new NotFoundException('El año lectivo destino no existe');
    }

    const estudiantesUnicos = new Set(
      dto.decisiones.map((decision) => decision.estudianteId),
    );
    if (estudiantesUnicos.size !== dto.decisiones.length) {
      throw new BadRequestException(
        'La lista de decisiones tiene estudiantes repetidos.',
      );
    }

    const idsDestino = [
      ...new Set(
        dto.decisiones
          .map((decision) => decision.destinoGrupoId)
          .filter((id): id is number => typeof id === 'number'),
      ),
    ];

    const gruposDestino = await this.cargarGruposConMaterias(idsDestino);
    for (const id of idsDestino) {
      const grupo = gruposDestino.get(id);
      if (!grupo) {
        throw new NotFoundException(`El grupo destino ${id} no existe`);
      }
      if (grupo.organizacionEscolar?.anio_lectivo?.id !== anioDestino.id) {
        throw new BadRequestException(
          `El grupo destino "${id}" no pertenece al año lectivo ${anioDestino.anio_lectivo}.`,
        );
      }
      if (!grupo.grupoAsignaturaDocente?.length) {
        throw new BadRequestException(
          `El grupo destino "${id}" no tiene materias asignadas.`,
        );
      }
    }

    const estudiantes = await this.dataSource
      .getRepository(StudentEntity)
      .find({ where: { id: In([...estudiantesUnicos]) } });
    const estudiantePorId = new Map(
      estudiantes.map((estudiante) => [estudiante.id, estudiante]),
    );
    const nombrePorId = new Map(
      estudiantes.map((estudiante) => [
        estudiante.id,
        `${estudiante.name} ${estudiante.lastName}`.trim(),
      ]),
    );

    return this.dataSource.transaction(async (manager) => {
      const detalle: DetallePromocion[] = [];
      let estudiantesPromovidos = 0;
      let estudiantesSinDestino = 0;
      let inscripcionesCreadas = 0;

      for (const decision of dto.decisiones) {
        const nombre = nombrePorId.get(decision.estudianteId) ?? '';

        if (!decision.destinoGrupoId) {
          // Se guarda la decisión: el estudiante queda inactivo en el grupo de
          // origen, así el grupo deja de aparecer como pendiente de promover.
          await this.marcarInactivoEnGrupo(
            manager,
            decision.estudianteId,
            grupoOrigen.id,
          );

          estudiantesSinDestino += 1;
          detalle.push({
            estudianteId: decision.estudianteId,
            nombre,
            grupoDestinoId: null,
            inscripcionesCreadas: 0,
            omitido: 'No continúa en el año destino',
          });
          continue;
        }

        const grupo = gruposDestino.get(decision.destinoGrupoId);
        if (!grupo) {
          throw new NotFoundException(
            `El grupo destino ${decision.destinoGrupoId} no existe.`,
          );
        }

        const yaEnDestino = await this.inscripcionActiva(
          manager,
          decision.estudianteId,
          grupo.id,
        );
        if (yaEnDestino) {
          detalle.push({
            estudianteId: decision.estudianteId,
            nombre,
            grupoDestinoId: grupo.id,
            inscripcionesCreadas: 0,
            omitido: 'Ya estaba inscrito en ese grupo',
          });
          continue;
        }

        const enOtroGrupo = await this.inscripcionEnOtroGrupoDelAnio(
          manager,
          decision.estudianteId,
          grupo.id,
          anioDestino.id,
        );
        if (enOtroGrupo) {
          throw new BadRequestException(
            `${nombre || `El estudiante ${decision.estudianteId}`} ya está inscrito en otro grupo del año ${anioDestino.anio_lectivo}.`,
          );
        }

        const estudiante = estudiantePorId.get(decision.estudianteId);
        if (!estudiante) {
          throw new BadRequestException(
            `El estudiante ${decision.estudianteId} no existe.`,
          );
        }

        const materias = grupo.grupoAsignaturaDocente ?? [];

        const nuevas = materias.map((asignacion) =>
          manager.create(GrupoAsignaturaConEstudiantes, {
            grupoAsignaturaDocente: asignacion,
            estudiante,
            activo: true,
            user_create_id: userId,
          }),
        );

        await manager.save(nuevas);

        estudiantesPromovidos += 1;
        inscripcionesCreadas += nuevas.length;
        detalle.push({
          estudianteId: decision.estudianteId,
          nombre,
          grupoDestinoId: grupo.id,
          inscripcionesCreadas: nuevas.length,
        });
      }

      return {
        estudiantesPromovidos,
        estudiantesSinDestino,
        inscripcionesCreadas,
        detalle,
      };
    });
  }

  /** Grupos de un año lectivo, ya normalizados para la respuesta. */
  private async cargarGrupos(anioLectivoId: number): Promise<GrupoResumen[]> {
    const grupos = await this.grupoRepo
      .createQueryBuilder('grupo')
      .leftJoinAndSelect('grupo.grado', 'grado')
      .leftJoinAndSelect('grupo.seccion', 'seccion')
      .leftJoinAndSelect('grupo.organizacionEscolar', 'org')
      .leftJoinAndSelect('org.anio_lectivo', 'anio')
      .leftJoinAndSelect('org.turno', 'turno')
      .leftJoinAndSelect('turno.modalidad', 'modalidad')
      .where('anio.id = :anioLectivoId', { anioLectivoId })
      .andWhere('grupo.deleted_at IS NULL')
      .orderBy('grado.orden', 'ASC')
      .addOrderBy('seccion.seccion', 'ASC')
      .getMany();

    return grupos.map((grupo) => this.aResumen(grupo));
  }

  /** Un grupo puntual con la misma forma que `cargarGrupos`. */
  private async cargarGrupo(grupoId: number): Promise<GrupoConEstudiantes> {
    const grupo = await this.grupoRepo
      .createQueryBuilder('grupo')
      .leftJoinAndSelect('grupo.grado', 'grado')
      .leftJoinAndSelect('grupo.seccion', 'seccion')
      .leftJoinAndSelect('grupo.organizacionEscolar', 'org')
      .leftJoinAndSelect('org.anio_lectivo', 'anio')
      .leftJoinAndSelect('org.turno', 'turno')
      .leftJoinAndSelect('turno.modalidad', 'modalidad')
      .where('grupo.id = :grupoId', { grupoId })
      .andWhere('grupo.deleted_at IS NULL')
      .getOne();

    if (!grupo) {
      throw new NotFoundException('El grupo no existe');
    }

    return { ...this.aResumen(grupo), estudiantes: 0 };
  }

  /** Grupos destino con sus materias, indexados por id. */
  private async cargarGruposConMaterias(
    ids: number[],
  ): Promise<Map<number, Grupos>> {
    if (ids.length === 0) return new Map();

    const grupos = await this.grupoRepo
      .createQueryBuilder('grupo')
      .leftJoinAndSelect('grupo.organizacionEscolar', 'org')
      .leftJoinAndSelect('org.anio_lectivo', 'anio')
      .leftJoinAndSelect('grupo.grupoAsignaturaDocente', 'asignacion')
      .where('grupo.id in (:...ids)', { ids })
      .andWhere('grupo.deleted_at IS NULL')
      .getMany();

    return new Map(grupos.map((grupo) => [grupo.id, grupo]));
  }

  /** Estudiantes distintos de un grupo, ordenados por nombre. */
  private async listarEstudiantesDeGrupo(grupoId: number) {
    const filas = await this.inscripcionRepo
      .createQueryBuilder('inscripcion')
      .innerJoinAndSelect('inscripcion.estudiante', 'estudiante')
      .innerJoin('inscripcion.grupoAsignaturaDocente', 'asignacion')
      .innerJoin('asignacion.grupo', 'grupo')
      .where('grupo.id = :grupoId', { grupoId })
      .andWhere('inscripcion.deleted_at IS NULL')
      .orderBy('estudiante.nombres', 'ASC')
      .addOrderBy('estudiante.apellidos', 'ASC')
      .getMany();

    const estudiantes = new Map<
      number,
      { id: number; nombre: string; codigo: string }
    >();

    for (const fila of filas) {
      const estudiante = fila.estudiante;
      if (!estudiante?.id || estudiantes.has(estudiante.id)) continue;

      estudiantes.set(estudiante.id, {
        id: estudiante.id,
        nombre: `${estudiante.name} ${estudiante.lastName}`.trim(),
        codigo: estudiante.studentCode,
      });
    }

    return [...estudiantes.values()];
  }

  private async inscripcionActiva(
    manager: DataSource['manager'],
    estudianteId: number,
    grupoId: number,
  ) {
    return manager
      .createQueryBuilder(GrupoAsignaturaConEstudiantes, 'inscripcion')
      .innerJoin('inscripcion.grupoAsignaturaDocente', 'asignacion')
      .innerJoin('asignacion.grupo', 'grupo')
      .where('inscripcion.estudiante = :estudianteId', { estudianteId })
      .andWhere('grupo.id = :grupoId', { grupoId })
      .andWhere('inscripcion.deleted_at IS NULL')
      .getOne();
  }

  /** Marca como inactivas las inscripciones del estudiante dentro de un grupo. */
  private async marcarInactivoEnGrupo(
    manager: DataSource['manager'],
    estudianteId: number,
    grupoId: number,
  ): Promise<void> {
    const filas = await manager
      .createQueryBuilder(GrupoAsignaturaConEstudiantes, 'inscripcion')
      .innerJoin('inscripcion.grupoAsignaturaDocente', 'asignacion')
      .innerJoin('asignacion.grupo', 'grupo')
      .where('inscripcion.estudiante = :estudianteId', { estudianteId })
      .andWhere('grupo.id = :grupoId', { grupoId })
      .andWhere('inscripcion.deleted_at IS NULL')
      .getMany();

    if (filas.length === 0) return;

    await manager
      .createQueryBuilder()
      .update(GrupoAsignaturaConEstudiantes)
      .set({ activo: false })
      .whereInIds(filas.map((fila) => fila.id))
      .execute();
  }

  private async inscripcionEnOtroGrupoDelAnio(
    manager: DataSource['manager'],
    estudianteId: number,
    grupoId: number,
    anioLectivoId: number,
  ) {
    return manager
      .createQueryBuilder(GrupoAsignaturaConEstudiantes, 'inscripcion')
      .innerJoin('inscripcion.grupoAsignaturaDocente', 'asignacion')
      .innerJoin('asignacion.grupo', 'grupo')
      .innerJoin('grupo.organizacionEscolar', 'org')
      .where('inscripcion.estudiante = :estudianteId', { estudianteId })
      .andWhere('org.anio_lectivo = :anioLectivoId', { anioLectivoId })
      .andWhere('grupo.id != :grupoId', { grupoId })
      .andWhere('inscripcion.deleted_at IS NULL')
      .getOne();
  }

  private aResumen(grupo: Grupos): GrupoResumen {
    const grado = grupo.grado?.grades ?? null;
    const seccion = grupo.seccion?.seccion ?? null;
    const turno = grupo.organizacionEscolar?.turno?.turno ?? null;
    const modalidad = grupo.organizacionEscolar?.turno?.modalidad?.modalidad ?? null;

    return {
      id: grupo.id,
      label: etiquetaGrupo(grado, seccion, turno, modalidad),
      gradoId: grupo.grado?.id ?? null,
      grado,
      ordenGrado: grupo.grado?.orden ?? null,
      seccionId: grupo.seccion?.id ?? null,
      seccion,
      turno,
      modalidad,
    };
  }
}
