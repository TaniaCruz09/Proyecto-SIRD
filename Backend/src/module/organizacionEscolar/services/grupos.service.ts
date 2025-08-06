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
            const grupo = await this.grupoRepository.find({
                relations: ['grado', 'seccion', 'modalidad', 'turno']
            });
            return grupo;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async getGrupoById(id: number): Promise<Grupos> {
        try {
            const grupo = await this.grupoRepository.findOne({
                where: { id },
                relations: ['grado', 'seccion', 'modalidad', 'turno']
            })
            return grupo;
        } catch (error) {
            Utilities.catchError(error)
        }
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
