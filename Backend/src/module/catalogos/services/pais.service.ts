import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Pais } from "../entities/pais.entity";
import { Repository } from "typeorm";
import { AcademicLevelEntity } from "..";
import { CreatePaisDto } from "../dtos/pais.dto";

@Injectable()
export class PaisService {
    constructor(
        @InjectRepository(Pais)
        private readonly paisRepository: Repository<Pais>,
    ) { }

    async createPais(payload: CreatePaisDto): Promise<Pais> {
        const pais = await this.paisRepository.create(payload)
        return await this.paisRepository.save(pais);
    }

    async findOne(id: number): Promise<Pais> {
        const pais = await this.paisRepository.findOne({ where: { id } });
        return pais;
    }

    async findAll(): Promise<Pais[]> {
        const pais = await this.paisRepository.find();
        return pais;
    }

    async update(id: number, payload: Partial<Pais>): Promise<Pais> {
        const pais = await this.paisRepository.findOne({
            where: { id }
        });

        Object.assign(pais, payload);

        pais.update_at = new Date();
        pais.user_update_id;

        return await this.paisRepository.save(pais);
    }

    async delete(id: number, userId: number): Promise<Pais> {
        const pais = await this.paisRepository.findOne({
            where: { id }
        });

        if (!pais) {
            throw new NotFoundException('Pais no encontrado');
        }

        pais.deleted_at = new Date()
        pais.deleted_at_id = userId;

        return await this.paisRepository.save(pais)
    }
}