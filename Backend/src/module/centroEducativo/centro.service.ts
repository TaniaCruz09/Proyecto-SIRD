import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Utilities } from '../../common/helpers/utilities';
import { Centro } from './entities/centro.entity';
import { CreateCentroDto } from './dto/create-centro.dto';
import { UpdateCentroDto } from './dto/update-centro.dto';

@Injectable()
export class CentroService {
    constructor(
        @InjectRepository(Centro)
        private centroReposiroty: Repository<Centro>
    ) { }

    async createCentro(createCentroDto: CreateCentroDto): Promise<Centro> {
        try {
            const nuevoCentro = this.centroReposiroty.create(createCentroDto);
            return await this.centroReposiroty.save(nuevoCentro)
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async getCentro(): Promise<Centro[]> {
        try {
            const centro = await this.centroReposiroty.find({
                relations: ['municipio']
            });
            return centro;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async getCentroById(id: number): Promise<Centro> {
        try {
            const centro = await this.centroReposiroty.findOne({
                where: { id },
                relations: ['municipio']
            })
            return centro;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async deleteCentro(id: number): Promise<Centro> {
        try {
            const Centro = await this.centroReposiroty.findOne({
                where: { id: id }
            });
            return await this.centroReposiroty.remove(Centro)
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async updateCentro(id: number, payload: UpdateCentroDto): Promise<Centro> {
        try {
            const Centro = await this.centroReposiroty.preload({ id, ...payload });
            if (!Centro) throw new NotFoundException(`Centro con ID ${id} no encontrado`);
            return await this.centroReposiroty.save(Centro);
        } catch (error) {
            Utilities.catchError(error)
        }
    }
}

