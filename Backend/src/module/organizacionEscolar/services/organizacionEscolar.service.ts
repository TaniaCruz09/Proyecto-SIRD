import { Injectable, NotFoundException } from '@nestjs/common';
import { OrganizacionEscolar } from '../entities/organizacionEscolar.entity.';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrganizacionEscolarDTO } from '../dtos/organizacionEscolar.dto';
import { Utilities } from 'src/common/helpers/utilities';
import { Docentes } from 'src/module/docentes/docentes.entity';
import { AnioLectivo, Asignatura, Cortes } from 'src/module/catalogos';
import { Grupos } from '../entities/grupos.entity';

@Injectable()
export class OrganizacionEscolarService {
  constructor(
    @InjectRepository(OrganizacionEscolar)
    private organizacionEscolarRepo: Repository<OrganizacionEscolar>,

    @InjectRepository(Docentes)
    private docenteRepo: Repository<Docentes>,

    @InjectRepository(Asignatura)
    private asignaturaRepo: Repository<Asignatura>,

    @InjectRepository(Cortes)
    private cortesRepo: Repository<Cortes>,

    @InjectRepository(Grupos)
    private grupoRepo: Repository<Grupos>,

    @InjectRepository(AnioLectivo)
    private anioRepo: Repository<AnioLectivo>,
  ) { }

  async createOrganizacion(
    createOrganizacionDto: CreateOrganizacionEscolarDTO,
  ): Promise<OrganizacionEscolar> {
    try {
      const {
        anio_lectivo,
        grupo,
        docenteGuia,
        docentes,
        asignaturas,
        cortes,
        user_create_id,
      } = createOrganizacionDto;

      const nuevaOrganizacion = this.organizacionEscolarRepo.create({
        anio_lectivo: await this.anioRepo.findOne({ where: { id: anio_lectivo.id } }),
        grupo: await this.grupoRepo.findOne({
          where: { id: grupo.id },
          relations: ['grado', 'seccion', 'modalidad', 'turno'],
        }),
        docenteGuia: await this.docenteRepo.findOne({
          where: { id: docenteGuia.id },
          relations: [
            'sexo',
            'nivel_academico',
            'profession',
            'pais',
            'municipio',
          ],
        }),
        // relaciones para el many-to-many
        docentes: await this.docenteRepo.findBy(
          docentes.map((d) => ({ id: d.id }))
        ),

        asignaturas: await this.asignaturaRepo.findBy(
          asignaturas.map((a) => ({ id: a.id }))
        ),

        cortes: await this.cortesRepo.findBy(
          cortes.map((c) => ({ id: c.id }))
        ),

        user_create_id,
      });

      return await this.organizacionEscolarRepo.save(nuevaOrganizacion);
    } catch (error) {
      Utilities.catchError(error);
    }
  }


  // async getOrganizacion(): Promise<OrganizacionEscolar[]> {
  //   try {
  //     const organizacion = await this.organizacionEscolarRepo.find({
  //       relations: ['anio_lectivo', "grupo", "grupo.grado", "grupo.seccion", "grupo.modalidad", "grupo.turno", "docenteGuia", "docentes", "asignaturas", "cortes"],
  //     });
  //     return organizacion;
  //   } catch (error) {
  //     Utilities.catchError(error);
  //   }
  // }
  async getOrganizacion(): Promise<OrganizacionEscolar[]> {
    try {
      const organizacion = await this.organizacionEscolarRepo
        .createQueryBuilder('organizacionEscolar')
        .leftJoinAndSelect('organizacionEscolar.anio_lectivo', 'anio_lectivo')
        .leftJoinAndSelect('organizacionEscolar.grupo', 'grupo')
        .leftJoinAndSelect('grupo.grado', 'grado')
        .leftJoinAndSelect('grupo.seccion', 'seccion')
        .leftJoinAndSelect('grupo.modalidad', 'modalidad')
        .leftJoinAndSelect('grupo.turno', 'turno')
        .leftJoinAndSelect('organizacionEscolar.docenteGuia', 'docenteGuia')
        .leftJoinAndSelect('organizacionEscolar.docentes', 'docentes')
        .leftJoinAndSelect('organizacionEscolar.asignaturas', 'asignaturas')
        .leftJoinAndSelect('organizacionEscolar.cortes', 'cortes')
        .leftJoinAndSelect('organizacionEscolar.estudiantes', 'estudiantes')
        .leftJoinAndSelect('estudiantes.estudiante', 'estudiante')
        .orderBy('organizacionEscolar.id', 'DESC')
        .getMany();

      return organizacion;
    } catch (error) {
      Utilities.catchError(error);
    }
  }
  async getOrganizacionById(id: number): Promise<OrganizacionEscolar> {
    try {
      const organizacion = await this.organizacionEscolarRepo.findOne({
        where: { id },
        relations: ['anio_lectivo', "grupo", "docenteGuia", "docentes", "asignaturas", "cortes"],
      });
      return organizacion;
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async editOrganizacion(
    id: number,
    payload: CreateOrganizacionEscolarDTO,
  ): Promise<OrganizacionEscolar> {
    try {
      const organizacion = await this.organizacionEscolarRepo.findOne({
        where: { id },
        relations: ['anio_lectivo', "grupo", "docenteGuia", "docentes", "asignaturas", "cortes"],
      });
      if (!organizacion) {
        throw new NotFoundException('Organizacion Escolar no encontrada');
      }
      // Actualizar solo los campos enviados, conservando los valores previos
      Object.assign(organizacion, payload);

      // Asignar la fecha de actualización y el usuario que modifica
      organizacion.update_at = new Date();
      organizacion.user_update_id;

      return await this.organizacionEscolarRepo.save(organizacion);
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async deleteOrganizacion(
    id: number,
    userId: number,
  ): Promise<OrganizacionEscolar> {
    try {
      const organizacion = await this.organizacionEscolarRepo.findOne({
        where: { id },
        relations: ['grupo'],
      });
      if (!organizacion) {
        throw new NotFoundException('Organizacion escolar no encontrada');
      }

      // Registrar el usuario que eliminó y la fecha de eliminación
      organizacion.deleted_at = new Date();
      organizacion.deleted_at_id = userId;

      return await this.organizacionEscolarRepo.save(organizacion);
    } catch (error) {
      Utilities.catchError(error);
    }
  }
}
