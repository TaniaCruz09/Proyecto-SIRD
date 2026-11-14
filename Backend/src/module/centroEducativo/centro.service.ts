import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
        const nuevoCentro = this.centroReposiroty.create(createCentroDto);
        return await this.centroReposiroty.save(nuevoCentro)
    }

    async getCentro(): Promise<Centro[]> {
        const centro = await this.centroReposiroty.find({
            relations: ['municipio']
        });
        return centro;
    }

    async getCentroById(id: number): Promise<Centro> {
        const centro = await this.centroReposiroty.findOne({
            where: { id },
            relations: ['municipio']
        })
        return centro;
    }

    async deleteCentro(id: number): Promise<Centro> {
        const Centro = await this.centroReposiroty.findOne({
            where: { id: id }
        });

        if (!Centro) throw new NotFoundException(`Centro con ID ${id} no encontrado`);

        return await this.centroReposiroty.remove(Centro)
    }

    async updateCentro(id: number, payload: UpdateCentroDto): Promise<Centro> {
        const Centro = await this.centroReposiroty.preload({ id, ...payload });
        if (!Centro) throw new NotFoundException(`Centro con ID ${id} no encontrado`);
        return await this.centroReposiroty.save(Centro);
    }
}

