import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Grupos } from '../entities/grupos.entity';
import { Repository } from 'typeorm';
import { Utilities } from '../../../common/helpers/utilities';
import { CreateGrupoDto } from '../../organizacionEscolar/dtos/grupos.dto';
import { UpdateGrupoDto } from '../../organizacionEscolar/dtos/Update-grupo.dto';


@Injectable()
export class GruposService {
    constructor(
        @InjectRepository(Grupos)
        private grupoRepository: Repository<Grupos>
    ) { }

    async createGrupo(createGrupoDto: CreateGrupoDto): Promise<Grupos> {
        try {
            const nuevoGrupo = this.grupoRepository.create(createGrupoDto);
            return await this.grupoRepository.save(nuevoGrupo)
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async getGrupo(): Promise<Grupos[]> {
        try {
            const grupos = await this.grupoRepository
                .createQueryBuilder("grupo")
                .leftJoinAndSelect("grupo.organizacionEscolar", "organizacionEscolar")
                .leftJoinAndSelect("organizacionEscolar.anio_lectivo", "anio_lectivo")
                .leftJoinAndSelect("organizacionEscolar.turno", "turnoOrganizacion")
                .leftJoinAndSelect("grupo.grado", "grado")
                .leftJoinAndSelect("grupo.seccion", "seccion")
                .leftJoinAndSelect("grupo.turno", "turno")
                .leftJoinAndSelect("turno.modalidad", "modalidad")
                .leftJoinAndSelect("grupo.docenteGuia", "docenteGuia")
                .getMany();

            return grupos;
        } catch (error) {
            Utilities.catchError(error);
        }
    }


    async getGrupoById(id: number): Promise<Grupos> {
        try {
            const grupo = await this.grupoRepository
                .createQueryBuilder("grupo")
                .leftJoinAndSelect("grupo.organizacionEscolar", "organizacionEscolar")
                .leftJoinAndSelect("organizacionEscolar.anio_lectivo", "anio_lectivo")
                .leftJoinAndSelect("organizacionEscolar.turno", "turnoOrganizacion")
                .leftJoinAndSelect("grupo.grado", "grado")
                .leftJoinAndSelect("grupo.seccion", "seccion")
                .leftJoinAndSelect("grupo.turno", "turno")
                .leftJoinAndSelect("turno.modalidad", "modalidad")
                .leftJoinAndSelect("grupo.docenteGuia", "docenteGuia")
                .leftJoinAndSelect("grupo.grupoAsignaturaDocente", "grupoAsignaturaDocente")
                .leftJoinAndSelect("grupoAsignaturaDocente.asignatura", "asignatura")
                .leftJoinAndSelect("asignatura.calificacion", "calificacion")
                .leftJoinAndSelect("calificacion.corte", "corte")
                .leftJoinAndSelect("grupoAsignaturaDocente.docente", "docente")
                .leftJoinAndSelect("grupoAsignaturaDocente.gruposConEstudiantes", "gruposConEstudiantes")
                .leftJoinAndSelect("gruposConEstudiantes.estudiante", "estudiante")
                .leftJoinAndSelect("estudiante.gender", "gender")
                .where("grupo.id = :id", { id })
                .getOne();

            return grupo;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async getGruposPorAnioYGrado(anioId: number, gradoId: number) {
        const grupos = await this.grupoRepository
            .createQueryBuilder('grupo')
            .leftJoinAndSelect('grupo.organizacionEscolar', 'org')
            .leftJoinAndSelect('org.anio_lectivo', 'anio')
            .leftJoinAndSelect('grupo.grado', 'grado')
            .leftJoinAndSelect('grupo.seccion', 'seccion')
            .leftJoinAndSelect('grupo.turno', 'turno')
            .leftJoinAndSelect('turno.modalidad', 'modalidad')
            .where('anio.id = :anioId', { anioId })
            .andWhere('grado.id = :gradoId', { gradoId }) // <-- filtro por grado
            .getMany();

        return grupos;
    }

    async deleteGrupos(id: number): Promise<Grupos> {
        try {
            const grupos = await this.grupoRepository.findOne({
                where: { id: id }
            });
            return await this.grupoRepository.remove(grupos)
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async updateGrupos(id: number, payload: UpdateGrupoDto): Promise<Grupos> {
        try {
            const grupos = await this.grupoRepository.preload({ id, ...payload });
            if (!grupos) throw new NotFoundException(`Grupos con ID ${id} no encontrado`);
            return await this.grupoRepository.save(grupos);
        } catch (error) {
            Utilities.catchError(error)
        }
    }
}
