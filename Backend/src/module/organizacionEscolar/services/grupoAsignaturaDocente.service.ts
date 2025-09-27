// src/module/organizacionEscolar/services/grupoAsignaturaDocente.service.ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GrupoAsignaturaDocente } from "../entities/grupoAsignaturaDocente.entity";
import { Grupos } from "../entities/grupos.entity";
import { Asignatura } from "src/module/catalogos";
import { Docentes } from "src/module/docentes/docentes.entity";
import { CrearGrupoAsignaturaDocenteDto } from "../dtos/grupoAsignaturaDocente";
import { ActualizarGrupoAsignaturaDocenteDto } from "../dtos/grupoAsignaturaDocenteUpdate";
import { Utilities } from "src/common/helpers/utilities";

@Injectable()
export class GrupoAsignaturaDocenteService {
  constructor(
    @InjectRepository(GrupoAsignaturaDocente)
    private readonly gadRepository: Repository<GrupoAsignaturaDocente>,

    @InjectRepository(Grupos)
    private readonly grupoRepository: Repository<Grupos>,

    @InjectRepository(Asignatura)
    private readonly asignaturaRepository: Repository<Asignatura>,

    @InjectRepository(Docentes)
    private readonly docenteRepository: Repository<Docentes>,
  ) { }

  // Crear asignaciones
  async asignarAsignaturasAGrupo(dto: CrearGrupoAsignaturaDocenteDto) {
    const grupo = await this.grupoRepository.findOneBy({ id: dto.grupoId });
    if (!grupo) throw new Error("Grupo no encontrado");

    // 1. Validar duplicados en el mismo payload
    const asignaturasIds = dto.asignaturasConDocentes.map(a => a.asignaturaId);
    const setIds = new Set(asignaturasIds);
    if (setIds.size !== asignaturasIds.length) {
      throw new Error("No se puede asignar la misma asignatura más de una vez en el mismo grupo");
    }

    // 2. Validar duplicados en la base de datos
    const existentes = await this.gadRepository.find({
      where: { grupo: { id: dto.grupoId } },
      relations: ["asignatura"],
    });
    const idsExistentes = existentes.map(e => e.asignatura.id);

    for (const item of dto.asignaturasConDocentes) {
      if (idsExistentes.includes(item.asignaturaId)) {
        throw new Error(`La asignatura con id ${item.asignaturaId} ya está asignada a este grupo`);
      }
    }

    // 3. Crear nuevas asignaciones
    const nuevasAsignaciones: GrupoAsignaturaDocente[] = [];
    for (const item of dto.asignaturasConDocentes) {
      const asignatura = await this.asignaturaRepository.findOneBy({ id: item.asignaturaId });
      if (!asignatura) throw new Error(`Asignatura con id ${item.asignaturaId} no encontrada`);

      const docente = await this.docenteRepository.findOneBy({ id: item.docenteId });
      if (!docente) throw new Error(`Docente con id ${item.docenteId} no encontrado`);

      const gad = this.gadRepository.create({ grupo, asignatura, docente });
      nuevasAsignaciones.push(gad);
    }

    return this.gadRepository.save(nuevasAsignaciones);
  }


  // Obtener todas las asignaciones (con joins explícitos)
  async obtenerTodasAsignaciones() {
    try {
      return this.gadRepository
        .createQueryBuilder("gad")
        .leftJoinAndSelect("gad.grupo", "grupo")
        .leftJoinAndSelect("grupo.organizacionEscolar", "org")
        .leftJoinAndSelect("org.anio_lectivo", "anio")
        .leftJoinAndSelect("org.turno", "turnoOrganizacion")
        .leftJoinAndSelect("grupo.grado", "grado")
        .leftJoinAndSelect("grupo.seccion", "seccion")
        .leftJoinAndSelect("grupo.turno", "turno")
        .leftJoinAndSelect("turno.modalidad", "modalidad")
        .leftJoinAndSelect("grupo.docenteGuia", "docenteGuia")
        .leftJoinAndSelect("gad.asignatura", "asignatura")
        .leftJoinAndSelect("gad.docente", "docente")
        .getMany();
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  // Obtener asignaciones de un grupo específico
  async obtenerAsignacionesPorGrupo(grupoId: number) {
    try {
      return this.gadRepository
        .createQueryBuilder("gad")
        .leftJoinAndSelect("gad.grupo", "grupo")
        .leftJoinAndSelect("grupo.organizacionEscolar", "org")
        .leftJoinAndSelect("org.anio_lectivo", "anio")
        .leftJoinAndSelect("grupo.grado", "grado")
        .leftJoinAndSelect("grupo.seccion", "seccion")
        .leftJoinAndSelect("grupo.turno", "turno")
        .leftJoinAndSelect("grupo.docenteGuia", "docenteGuia")
        .leftJoinAndSelect("gad.asignatura", "asignatura")
        .leftJoinAndSelect("gad.docente", "docente")
        .where("grupo.id = :grupoId", { grupoId })
        .getMany();
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  // Obtener asignación por su ID
  async obtenerAsignacionPorId(id: number) {
    const asignacion = await this.gadRepository.findOne({
      where: { id },
      relations: ["grupo", "grupo.docenteGuia", "asignatura", "docente"],
    });
    if (!asignacion) throw new Error(`Asignación con id ${id} no encontrada`);
    return asignacion;
  }

  async editarAsignacion(
    grupoId: number,
    data: ActualizarGrupoAsignaturaDocenteDto
  ) {
    if (!data.asignaturasConDocentes || data.asignaturasConDocentes.length === 0) {
      throw new Error("No hay asignaciones para actualizar");
    }

    // Validar duplicados en el payload
    const asignaturasIds = data.asignaturasConDocentes.map(a => a.asignaturaId);
    const setIds = new Set(asignaturasIds);
    if (setIds.size !== asignaturasIds.length) {
      throw new Error("No se puede asignar la misma asignatura más de una vez en el mismo grupo");
    }

    const grupo = await this.grupoRepository.findOneBy({ id: grupoId });
    if (!grupo) throw new Error(`Grupo con id ${grupoId} no encontrado`);

    // Eliminar actuales
    await this.gadRepository.delete({ grupo: { id: grupoId } });

    // Crear nuevas
    const nuevasAsignaciones: GrupoAsignaturaDocente[] = [];
    for (const item of data.asignaturasConDocentes) {
      const asignatura = await this.asignaturaRepository.findOneBy({ id: item.asignaturaId });
      if (!asignatura) throw new Error(`Asignatura con id ${item.asignaturaId} no encontrada`);

      const docente = await this.docenteRepository.findOneBy({ id: item.docenteId });
      if (!docente) throw new Error(`Docente con id ${item.docenteId} no encontrado`);

      const nuevaAsignacion = this.gadRepository.create({
        grupo,
        asignatura,
        docente,
      });

      nuevasAsignaciones.push(nuevaAsignacion);
    }

    return this.gadRepository.save(nuevasAsignaciones);
  }


  // src/module/organizacionEscolar/services/grupoAsignaturaDocente.service.ts
  async eliminarAsignacionPorGrupoYAsignatura(grupoId: number, asignaturaId: number) {
    const resultado = await this.gadRepository.delete({
      grupo: { id: grupoId },
      asignatura: { id: asignaturaId },
    });

    if (resultado.affected === 0) {
      throw new Error(`No se encontró la asignación del grupo ${grupoId} con la asignatura ${asignaturaId}`);
    }

    return resultado;
  }

  // Eliminar todas las asignaciones de un grupo
  async eliminarAsignacionesPorGrupo(grupoId: number) {
    // Verificar que exista el grupo antes de borrar
    const grupo = await this.grupoRepository.findOneBy({ id: grupoId });
    if (!grupo) throw new Error(`Grupo con id ${grupoId} no encontrado`);

    return this.gadRepository.delete({ grupo: { id: grupoId } });
  }
}
