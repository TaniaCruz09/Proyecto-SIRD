import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { AnioLectivo } from '../../module/catalogos/entities/anioLectivo.entity';
import { OrganizacionEscolar } from '../../module/organizacionEscolar/entities/organizacionEscolar.entity';
import { Grupos } from '../../module/organizacionEscolar/entities/grupos.entity';

/** Cualquier repositorio sirve: solo se usa su `manager` para consultar. */
type ConManager = { manager: EntityManager };

const esVerdadero = (valor: unknown): boolean =>
  valor === true || valor === 'true' || valor === 1 || valor === '1';

/**
 * Un año lectivo inactivo es de solo consulta: se puede ver toda la
 * organización, los grupos, docentes y estudiantes, pero no modificarlos.
 * Estas funciones son el candado que aplican los servicios de escritura.
 */
export const asegurarAnioActivo = (anio?: AnioLectivo | null): void => {
  if (!anio) {
    throw new NotFoundException('No se encontró el año lectivo');
  }

  if (!esVerdadero(anio.isActive)) {
    throw new ForbiddenException(
      `El año lectivo ${anio.anio_lectivo} está inactivo: solo se puede consultar. Actívalo para hacer cambios.`,
    );
  }
};

/** Candado a partir del id del año lectivo. */
export const asegurarAnioActivoPorId = async (
  repo: ConManager,
  anioLectivoId: number,
): Promise<void> => {
  const anio = await repo.manager
    .getRepository(AnioLectivo)
    .findOne({ where: { id: anioLectivoId } });

  asegurarAnioActivo(anio);
};

/** Candado a partir de una organización escolar. */
export const asegurarAnioActivoDeOrganizacion = async (
  repo: ConManager,
  organizacionId: number,
): Promise<void> => {
  const organizacion = await repo.manager
    .getRepository(OrganizacionEscolar)
    .createQueryBuilder('org')
    .leftJoinAndSelect('org.anio_lectivo', 'anio')
    .where('org.id = :organizacionId', { organizacionId })
    .getOne();

  if (!organizacion) {
    throw new NotFoundException(
      `Organización escolar con ID ${organizacionId} no encontrada`,
    );
  }

  asegurarAnioActivo(organizacion.anio_lectivo);
};

/** Candado a partir de un grupo. */
export const asegurarAnioActivoDelGrupo = async (
  repo: ConManager,
  grupoId: number,
): Promise<void> => {
  const grupo = await repo.manager
    .getRepository(Grupos)
    .createQueryBuilder('grupo')
    .leftJoinAndSelect('grupo.organizacionEscolar', 'org')
    .leftJoinAndSelect('org.anio_lectivo', 'anio')
    .where('grupo.id = :grupoId', { grupoId })
    .getOne();

  if (!grupo) {
    throw new NotFoundException(`Grupo con ID ${grupoId} no encontrado`);
  }

  asegurarAnioActivo(grupo.organizacionEscolar?.anio_lectivo);
};
