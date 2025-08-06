import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Utilities } from '../../../common/helpers/utilities';
import { UpdateGrupoConEstudiantesDto } from '../dtos/updateOrganizacionConEstudiantes.dto';
import { OrganizacionConEstudiantes } from '../entities/organizacionConEstudiante';
import { OrganizacionEscolar } from '../entities/organizacionEscolar.entity.';
import { StudentEntity } from 'src/module/createEstudents';
import { User } from 'src/module/auth/entities';
import { CreateOrganizacionConEstudiantesDto } from '../dtos/organizacionConEstudiantes.dto';

@Injectable()
export class OrganizacionConEstudiantesService {
    constructor(
        @InjectRepository(OrganizacionConEstudiantes)
        private orgEstRepository: Repository<OrganizacionConEstudiantes>,

        // @InjectRepository(OrganizacionEscolar)
        // private readonly organizacionRepo: Repository<OrganizacionEscolar>,

        // @InjectRepository(StudentEntity)
        // private readonly estudianteRepo: Repository<StudentEntity>,

        // @InjectRepository(User)
        // private readonly userRepo: Repository<User>,
    ) { }

    async createGrupo(createGrupoDto: CreateOrganizacionConEstudiantesDto): Promise<OrganizacionConEstudiantes> {
        try {
            const nuevoGrupo = this.orgEstRepository.create(createGrupoDto);
            return await this.orgEstRepository.save(nuevoGrupo)
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async getGrupo(): Promise<OrganizacionConEstudiantes[]> {
        try {
            const grupo = await this.orgEstRepository.find({
                relations: ['grupo', 'estudiante']
            });
            return grupo;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async getGrupoById(id: number): Promise<OrganizacionConEstudiantes> {
        try {
            const grupo = await this.orgEstRepository.findOne({
                where: { id },
                relations: ['grupo', 'estudiante']
            })
            return grupo;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async deleteGrupos(id: number): Promise<OrganizacionConEstudiantes> {
        try {
            const grupos = await this.orgEstRepository.findOne({
                where: { id: id }
            });
            return await this.orgEstRepository.remove(grupos)
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async updateGrupos(id: number, payload: UpdateGrupoConEstudiantesDto): Promise<OrganizacionConEstudiantes> {
        try {
            const grupos = await this.orgEstRepository.preload({ id, ...payload });
            if (!grupos) throw new NotFoundException(`Grupos con ID ${id} no encontrado`);
            return await this.orgEstRepository.save(grupos);
        } catch (error) {
            Utilities.catchError(error)
        }
    }
}
