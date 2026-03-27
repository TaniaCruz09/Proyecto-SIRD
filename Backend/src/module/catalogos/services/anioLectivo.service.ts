import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Utilities } from 'src/common/helpers/utilities';
import { AnioLectivo } from '../entities/anioLectivo.entity';
import { CreateAnioLectivoDTO } from '../dtos/anioLectivo.dto';
import { Cortes } from '../entities/corte.entity';
import { AnioLectivoCorte } from '../entities/anioLectivoCorte.entity';
import { PeriodoLectivo } from '../entities/periodoLectivo.entity';
import { PeriodoLectivoCorte } from '../entities/periodoLectivoCorte.entity';
import { TipoPeriodizacion } from '../entities/tipoPeriodizacion.entity';
import { OrganizacionEscolar } from 'src/module/organizacionEscolar/entities/organizacionEscolar.entity';
import { Grupos } from 'src/module/organizacionEscolar/entities/grupos.entity';
import { GrupoAsignaturaDocente } from 'src/module/organizacionEscolar/entities/GrupoAsignaturaDocente.entity';
import { GrupoAsignaturaConEstudiantes } from 'src/module/organizacionEscolar/entities/grupo-asignatura-con-estudiantes.entity';

@Injectable()
export class AnioLectivoService {
    constructor(
        @InjectRepository(AnioLectivo)
        private anioLectivoRepo: Repository<AnioLectivo>,
        @InjectRepository(AnioLectivoCorte)
        private anioLectivoCorteRepo: Repository<AnioLectivoCorte>,
        @InjectRepository(Cortes)
        private corteRepo: Repository<Cortes>,
        @InjectRepository(PeriodoLectivo)
        private periodoLectivoRepo: Repository<PeriodoLectivo>,
        @InjectRepository(PeriodoLectivoCorte)
        private periodoLectivoCorteRepo: Repository<PeriodoLectivoCorte>,
        @InjectRepository(TipoPeriodizacion)
        private tipoPeriodizacionRepo: Repository<TipoPeriodizacion>,
    ) { }

    private isMissingPeriodoTableError(error: unknown): boolean {
        const message = (error as { message?: string })?.message ?? '';
        return (
            message.includes('catalogos.periodo_lectivo') ||
            message.includes('periodo_lectivo_corte')
        );
    }

    private buildAnioLectivoQuery(includePeriodos: boolean) {
        const query = this.anioLectivoRepo
            .createQueryBuilder('anio_lectivo')
            .leftJoinAndSelect('anio_lectivo.cortesAnioLectivo', 'anioLectivoCorte')
            .leftJoinAndSelect('anioLectivoCorte.corte', 'corte')
            .leftJoinAndSelect('corte.semestre', 'semestre')
            .leftJoinAndSelect('anio_lectivo.organizacionEscolar', 'organizacionEscolar')
            .leftJoinAndSelect('organizacionEscolar.turno', 'turno')
            .leftJoinAndSelect('turno.modalidad', 'modalidad');

        if (includePeriodos) {
            query
                .leftJoinAndSelect('anio_lectivo.periodosLectivos', 'periodoLectivo')
                .leftJoinAndSelect('periodoLectivo.cortesPeriodo', 'periodoLectivoCorte')
                .leftJoinAndSelect('periodoLectivoCorte.corte', 'cortePeriodo')
                .leftJoinAndSelect('cortePeriodo.semestre', 'semestreCortePeriodo');
        }

        return query;
    }

    private attachCortes(anioLectivo: AnioLectivo | null): AnioLectivo | null {
        if (!anioLectivo) {
            return null;
        }
        const legacyCortes = anioLectivo.cortesAnioLectivo?.map((item) => item.corte) ?? [];
        const dynamicCortes =
            anioLectivo.periodosLectivos
                ?.flatMap((periodo) => periodo.cortesPeriodo?.map((item) => item.corte) ?? [])
                .filter(Boolean) ?? [];

        const mergedMap = new Map<number, Cortes>();
        for (const corte of [...legacyCortes, ...dynamicCortes]) {
            if (corte?.id != null && !mergedMap.has(corte.id)) {
                mergedMap.set(corte.id, corte);
            }
        }

        anioLectivo.cortes = Array.from(mergedMap.values());
        delete (anioLectivo as Partial<AnioLectivo>).cortesAnioLectivo;

        (anioLectivo as AnioLectivo & { periodos?: unknown[] }).periodos =
            (anioLectivo.periodosLectivos ?? [])
                .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
                .map((periodo) => ({
                    id: periodo.id,
                    nombre: periodo.nombre,
                    abreviatura: periodo.abreviatura,
                    tipo: periodo.tipo,
                    orden: periodo.orden,
                    cortes: (periodo.cortesPeriodo ?? [])
                        .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
                        .map((item) => ({
                            ...(item.corte ?? {}),
                            orden: item.orden,
                        })),
                }));

        delete (anioLectivo as Partial<AnioLectivo>).periodosLectivos;
        return anioLectivo;
    }

    private attachCortesList(anioLectivos: AnioLectivo[]): AnioLectivo[] {
        return anioLectivos.map((item) => this.attachCortes(item)).filter(Boolean) as AnioLectivo[];
    }

    private normalizeTipoPeriodizacion(tipo?: string): string {
        return (tipo || 'PERSONALIZADO').trim().toUpperCase();
    }

    private resolveFallbackTipoConfig(tipo: string, cantidadPeriodos?: number) {
        switch (tipo) {
            case 'SEMESTRE':
                return { codigo: tipo, totalPeriodos: 2, etiquetaPeriodo: 'Semestre', prefijoAbreviatura: 'S' };
            case 'CUATRIMESTRE':
                return { codigo: tipo, totalPeriodos: 3, etiquetaPeriodo: 'Cuatrimestre', prefijoAbreviatura: 'C' };
            case 'TRIMESTRE':
                return { codigo: tipo, totalPeriodos: 4, etiquetaPeriodo: 'Trimestre', prefijoAbreviatura: 'T' };
            case 'BIMESTRE':
                return { codigo: tipo, totalPeriodos: 6, etiquetaPeriodo: 'Bimestre', prefijoAbreviatura: 'B' };
            default:
                return {
                    codigo: 'PERSONALIZADO',
                    totalPeriodos:
                        Number.isFinite(cantidadPeriodos) && Number(cantidadPeriodos) > 0
                            ? Number(cantidadPeriodos)
                            : 1,
                    etiquetaPeriodo: 'Periodo',
                    prefijoAbreviatura: 'P',
                };
        }
    }

    private async resolveTipoPeriodizacionConfig(tipo: string, cantidadPeriodos?: number) {
        const tipoNormalizado = this.normalizeTipoPeriodizacion(tipo);

        const tipoConfig = await this.tipoPeriodizacionRepo.findOne({
            where: { codigo: tipoNormalizado, isActive: true, delete_at: null },
        });

        if (!tipoConfig) {
            return this.resolveFallbackTipoConfig(tipoNormalizado, cantidadPeriodos);
        }

        const totalPeriodos =
            tipoNormalizado === 'PERSONALIZADO'
                ? Number.isFinite(cantidadPeriodos) && Number(cantidadPeriodos) > 0
                    ? Number(cantidadPeriodos)
                    : tipoConfig.cantidad_periodos || 1
                : tipoConfig.cantidad_periodos || 1;

        return {
            codigo: tipoNormalizado,
            totalPeriodos,
            etiquetaPeriodo: tipoConfig.etiqueta_periodo || tipoConfig.nombre || 'Periodo',
            prefijoAbreviatura: tipoConfig.prefijo_abreviatura || tipoConfig.codigo?.charAt(0) || 'P',
        };
    }

    private buildPeriodoNombre(etiquetaPeriodo: string, prefijoAbreviatura: string, orden: number): { nombre: string; abreviatura: string } {
        const etiqueta = (etiquetaPeriodo || 'Periodo').trim();
        const prefijo = (prefijoAbreviatura || 'P').trim();

        return {
            nombre: `${etiqueta} ${orden}`,
            abreviatura: `${prefijo}${orden}`,
        };
    }

    private async generateAutomaticPeriodos(
        anioLectivoId: number,
        tipoPeriodizacion: string,
        cantidadCortes: number,
        auditUserId?: number,
        cantidadPeriodos?: number,
    ): Promise<void> {
        const tipoConfig = await this.resolveTipoPeriodizacionConfig(tipoPeriodizacion, cantidadPeriodos);
        const tipo = tipoConfig.codigo;
        const totalCortes = Number(cantidadCortes);
        const totalPeriodos = tipoConfig.totalPeriodos;

        if (!Number.isFinite(totalCortes) || totalCortes <= 0) {
            throw new BadRequestException('La cantidad de cortes debe ser mayor que cero');
        }

        if (totalPeriodos <= 0) {
            throw new BadRequestException('La cantidad de periodos debe ser mayor que cero');
        }

        if (totalCortes < totalPeriodos) {
            throw new BadRequestException('La cantidad de cortes no puede ser menor que la cantidad de periodos');
        }

        await this.anioLectivoCorteRepo.delete({ anioLectivoId });
        await this.periodoLectivoRepo.delete({ anioLectivoId });

        const baseCortes = Math.floor(totalCortes / totalPeriodos);
        const remainder = totalCortes % totalPeriodos;

        const generatedCortes = await this.corteRepo.save(
            Array.from({ length: totalCortes }, (_, index) =>
                this.corteRepo.create({
                    abreviatura: `C${index + 1}`,
                    corte: `Corte ${index + 1}`,
                    user_create_id: auditUserId,
                }),
            ),
        );

        const periodoRows = await this.periodoLectivoRepo.save(
            Array.from({ length: totalPeriodos }, (_, index) => {
                const orden = index + 1;
                const naming = this.buildPeriodoNombre(
                    tipoConfig.etiquetaPeriodo,
                    tipoConfig.prefijoAbreviatura,
                    orden,
                );

                return this.periodoLectivoRepo.create({
                    anioLectivo: { id: anioLectivoId } as AnioLectivo,
                    nombre: naming.nombre,
                    abreviatura: naming.abreviatura,
                    tipo,
                    orden,
                });
            }),
        );

        const relationRows: PeriodoLectivoCorte[] = [];
        let currentIndex = 0;

        for (let i = 0; i < periodoRows.length; i++) {
            const periodo = periodoRows[i];
            const cortesEnPeriodo = baseCortes + (i < remainder ? 1 : 0);

            for (let j = 0; j < cortesEnPeriodo; j++) {
                const corte = generatedCortes[currentIndex];
                if (!corte?.id) {
                    break;
                }

                relationRows.push(
                    this.periodoLectivoCorteRepo.create({
                        periodoLectivo: { id: periodo.id } as PeriodoLectivo,
                        corte: { id: corte.id } as Cortes,
                        orden: j + 1,
                    }),
                );

                currentIndex += 1;
            }
        }

        if (relationRows.length > 0) {
            await this.periodoLectivoCorteRepo.save(relationRows);
        }
    }

    async createAnioLectivo(
        createAnioLectivoDto: CreateAnioLectivoDTO,
    ): Promise<AnioLectivo> {
        try {
            const {
                cortes,
                periodos,
                tipo_periodizacion,
                cantidad_periodos,
                cantidad_cortes,
                ...anioData
            } = createAnioLectivoDto;

            const existingAnioLectivo = await this.anioLectivoRepo.findOne({
                where: { anio_lectivo: anioData.anio_lectivo },
            });

            if (existingAnioLectivo) {
                throw new BadRequestException(`El año lectivo ${anioData.anio_lectivo} ya existe`);
            }

            const nuevoAnioLectivo = await this.anioLectivoRepo.create(anioData);
            const saved = await this.anioLectivoRepo.save(nuevoAnioLectivo);

            if (Array.isArray(periodos) && periodos.length > 0) {
                await this.replacePeriodos(saved.id, periodos);
            } else if (Number.isFinite(cantidad_cortes) && cantidad_cortes > 0) {
                await this.generateAutomaticPeriodos(
                    saved.id,
                    tipo_periodizacion,
                    cantidad_cortes,
                    createAnioLectivoDto.user_create_id,
                    cantidad_periodos,
                );
            }

            if (Array.isArray(cortes)) {
                await this.replaceCortes(saved.id, cortes);
            }

            return await this.getAnioLectivoById(saved.id);
        } catch (error) {
            Utilities.catchError(error);
        }
    }

    async getAnioLectivo(): Promise<AnioLectivo[]> {
        try {
            try {
                const anioLectivo = await this.buildAnioLectivoQuery(true)
                    .orderBy('anio_lectivo.anio_lectivo', 'DESC')
                    .getMany();
                return this.attachCortesList(anioLectivo);
            } catch (error) {
                if (!this.isMissingPeriodoTableError(error)) {
                    throw error;
                }

                const anioLectivo = await this.buildAnioLectivoQuery(false)
                    .orderBy('anio_lectivo.anio_lectivo', 'DESC')
                    .getMany();
                return this.attachCortesList(anioLectivo);
            }
        } catch (error) {
            Utilities.catchError(error);
        }
    }

    async getAnioLectivoById(id: number): Promise<AnioLectivo> {
        try {
            try {
                const anioLectivo = await this.buildAnioLectivoQuery(true)
                    .leftJoinAndSelect('organizacionEscolar.grupos', 'grupos')
                    .where('anio_lectivo.id = :id', { id })
                    .orderBy('anio_lectivo.anio_lectivo', 'DESC')
                    .getOne();

                return this.attachCortes(anioLectivo)
            } catch (error) {
                if (!this.isMissingPeriodoTableError(error)) {
                    throw error;
                }

                const anioLectivo = await this.buildAnioLectivoQuery(false)
                    .leftJoinAndSelect('organizacionEscolar.grupos', 'grupos')
                    .where('anio_lectivo.id = :id', { id })
                    .orderBy('anio_lectivo.anio_lectivo', 'DESC')
                    .getOne();

                return this.attachCortes(anioLectivo)
            }
        } catch (error) {
            Utilities.catchError(error);
            return null;
        }
    }

    async editAnioLectivo(
        id: number,
        payload: CreateAnioLectivoDTO,
    ): Promise<AnioLectivo> {
        try {
            const {
                cortes,
                periodos,
                tipo_periodizacion,
                cantidad_periodos,
                cantidad_cortes,
                ...anioData
            } = payload;
            const anioLectivo = await this.anioLectivoRepo.findOne({ where: { id } });
            if (!anioLectivo) {
                throw new NotFoundException('Año Lectivo no editado');
            }

            const requestedAnioLectivo = anioData.anio_lectivo;
            if (
                Number.isFinite(requestedAnioLectivo) &&
                requestedAnioLectivo !== anioLectivo.anio_lectivo
            ) {
                const existingAnioLectivo = await this.anioLectivoRepo.findOne({
                    where: { anio_lectivo: requestedAnioLectivo },
                });

                if (existingAnioLectivo && existingAnioLectivo.id !== id) {
                    throw new BadRequestException(`El año lectivo ${requestedAnioLectivo} ya existe`);
                }
            }

            // Actualizar solo los campos enviados, conservando los valores previos
            Object.assign(anioLectivo, anioData);

            // Asignar la fecha de actualización y el usuario que modifica
            anioLectivo.update_at = new Date();
            anioLectivo.user_update_id;

            const saved = await this.anioLectivoRepo.save(anioLectivo);

            if (Array.isArray(periodos) && periodos.length > 0) {
                await this.replacePeriodos(saved.id, periodos);
            } else if (Number.isFinite(cantidad_cortes) && cantidad_cortes > 0) {
                await this.generateAutomaticPeriodos(
                    saved.id,
                    tipo_periodizacion,
                    cantidad_cortes,
                    payload.user_update_id,
                    cantidad_periodos,
                );
            }

            if (Array.isArray(cortes)) {
                await this.replaceCortes(saved.id, cortes);
            }

            return await this.getAnioLectivoById(saved.id);
        } catch (error) {
            Utilities.catchError(error);
        }
    }

    async assignCortes(
        id: number,
        cortes: { id: number }[],
    ): Promise<AnioLectivo> {
        try {
            const anioLectivo = await this.anioLectivoRepo.findOne({ where: { id } });
            if (!anioLectivo) {
                throw new NotFoundException('Año Lectivo no encontrado');
            }

            await this.replaceCortes(anioLectivo.id, cortes);

            return await this.getAnioLectivoById(id);
        } catch (error) {
            Utilities.catchError(error);
        }
    }

    private async replaceCortes(anioLectivoId: number, cortes: { id: number }[]): Promise<void> {
        const ids = (cortes ?? []).map((corte) => corte?.id).filter((id) => Number.isFinite(id));
        const uniqueIds = Array.from(new Set(ids));

        await this.anioLectivoCorteRepo.delete({ anioLectivoId });

        if (uniqueIds.length === 0) return;

        const validCortes = await this.corteRepo.find({
            where: { id: In(uniqueIds), delete_at: null },
            select: ['id'],
        });
        const validIds = new Set(validCortes.map((corte) => corte.id));
        if (validIds.size !== uniqueIds.length) {
            throw new BadRequestException('Uno o mas cortes no existen o estan eliminados');
        }

        const rows = Array.from(validIds).map((corteId) =>
            this.anioLectivoCorteRepo.create({
                anioLectivo: { id: anioLectivoId } as AnioLectivo,
                corte: { id: corteId } as Cortes,
            })
        );

        await this.anioLectivoCorteRepo.save(rows);
    }

    private async replacePeriodos(
        anioLectivoId: number,
        periodos: {
            nombre?: string;
            abreviatura?: string;
            tipo?: string;
            orden?: number;
            cortes?: { id: number; orden?: number }[];
        }[],
    ): Promise<void> {
        await this.periodoLectivoRepo.delete({ anioLectivoId });

        const normalized = (periodos ?? [])
            .map((periodo, index) => ({
                nombre: periodo?.nombre?.trim(),
                abreviatura: periodo?.abreviatura?.trim() || null,
                tipo: (periodo?.tipo?.trim() || 'PERSONALIZADO').toUpperCase(),
                orden: Number.isFinite(periodo?.orden as number)
                    ? Number(periodo.orden)
                    : index + 1,
                cortes: Array.isArray(periodo?.cortes) ? periodo.cortes : [],
            }))
            .filter((periodo) => Boolean(periodo.nombre));

        if (normalized.length === 0) {
            return;
        }

        const periodoRows = normalized.map((periodo) =>
            this.periodoLectivoRepo.create({
                anioLectivo: { id: anioLectivoId } as AnioLectivo,
                nombre: periodo.nombre,
                abreviatura: periodo.abreviatura,
                tipo: periodo.tipo,
                orden: periodo.orden,
            }),
        );

        const savedPeriodos = await this.periodoLectivoRepo.save(periodoRows);

        const corteIds = Array.from(
            new Set(
                normalized
                    .flatMap((periodo) => periodo.cortes)
                    .map((corte) => corte?.id)
                    .filter((id) => Number.isFinite(id)),
            ),
        );

        if (corteIds.length === 0) {
            return;
        }

        const validCortes = await this.corteRepo.find({
            where: { id: In(corteIds), delete_at: null },
            select: ['id'],
        });
        const validIds = new Set(validCortes.map((corte) => corte.id));
        if (validIds.size !== corteIds.length) {
            throw new BadRequestException('Uno o mas cortes no existen o estan eliminados');
        }

        const relationRows: PeriodoLectivoCorte[] = [];
        for (let i = 0; i < savedPeriodos.length; i++) {
            const savedPeriodo = savedPeriodos[i];
            const originalPeriodo = normalized[i];
            for (const corteRef of originalPeriodo.cortes) {
                const corteId = corteRef?.id;
                if (!Number.isFinite(corteId) || !validIds.has(corteId)) {
                    continue;
                }
                relationRows.push(
                    this.periodoLectivoCorteRepo.create({
                        periodoLectivo: { id: savedPeriodo.id } as PeriodoLectivo,
                        corte: { id: corteId } as Cortes,
                        orden: Number.isFinite(corteRef?.orden)
                            ? Number(corteRef.orden)
                            : undefined,
                    }),
                );
            }
        }

        if (relationRows.length > 0) {
            await this.periodoLectivoCorteRepo.save(relationRows);
        }
    }

    async deleteAnioLectivo(
        id: number,
        userId: number,
    ): Promise<AnioLectivo> {
        try {
            return await this.anioLectivoRepo.manager.transaction(async (manager) => {
                const anioLectivo = await manager.getRepository(AnioLectivo).findOne({
                    where: { id },
                    relations: ['organizacionEscolar', 'organizacionEscolar.grupos'],
                });
                if (!anioLectivo) {
                    throw new NotFoundException('Año lectivo no eliminado');
                }

                const organizacionIds = (anioLectivo.organizacionEscolar ?? [])
                    .map((org) => org.id)
                    .filter((orgId) => Number.isFinite(orgId));

                const grupoIds = (anioLectivo.organizacionEscolar ?? [])
                    .flatMap((org) => org.grupos?.map((grupo) => grupo.id) ?? [])
                    .filter((grupoId) => Number.isFinite(grupoId));

                if (grupoIds.length > 0) {
                    const gadRows = await manager
                        .getRepository(GrupoAsignaturaDocente)
                        .createQueryBuilder('gad')
                        .select('gad.id', 'id')
                        .where('gad.grupo_id IN (:...grupoIds)', { grupoIds })
                        .getRawMany();

                    const gadIds = gadRows.map((row) => row.id).filter((gadId) => Number.isFinite(gadId));

                    if (gadIds.length > 0) {
                        await manager
                            .getRepository(GrupoAsignaturaConEstudiantes)
                            .createQueryBuilder()
                            .delete()
                            .from(GrupoAsignaturaConEstudiantes)
                            .where('grupoAsignaturaDocenteId IN (:...gadIds)', { gadIds })
                            .execute();
                    }

                    await manager
                        .getRepository(GrupoAsignaturaDocente)
                        .createQueryBuilder()
                        .delete()
                        .from(GrupoAsignaturaDocente)
                        .where('grupo_id IN (:...grupoIds)', { grupoIds })
                        .execute();

                    await manager.getRepository(Grupos).update(
                        { id: In(grupoIds) },
                        { deleted_at: new Date(), deleted_at_id: userId },
                    );
                }

                if (organizacionIds.length > 0) {
                    await manager.getRepository(OrganizacionEscolar).update(
                        { id: In(organizacionIds) },
                        { deleted_at: new Date(), deleted_at_id: userId },
                    );
                }

                await manager.getRepository(AnioLectivoCorte).delete({ anioLectivoId: id });

                // Registrar el usuario que eliminó y la fecha de eliminación
                anioLectivo.deleted_at = new Date();
                anioLectivo.deleted_at_id = userId;

                return await manager.getRepository(AnioLectivo).save(anioLectivo);
            });
        } catch (error) {
            Utilities.catchError(error);
        }
    }
}
