import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Municipio } from "../entities/municipio.entity";
import { Repository } from "typeorm";
import { CreateMunicipioDto } from "../dtos/municipio.dto";

@Injectable()
export class MunicipioService {
    constructor(
        @InjectRepository(Municipio)
        private municipioRepository: Repository<Municipio>,
    ) { }

    async create(Payload: CreateMunicipioDto): Promise<Municipio> {
        const municipio = await this.municipioRepository.create(Payload)
        return await this.municipioRepository.save(municipio);
    }

    async findOne(id: number): Promise<Municipio> {
        const municipio = await this.municipioRepository.findOne({ where: { id }, relations: ["departamento"] });
        return municipio;
    }

    async findAll(): Promise<Municipio[]> {
        const municipio = await this.municipioRepository.find({ relations: ["departamento"] });
                    return municipio;
    }

    async update(id: number, payload: Partial<Municipio>): Promise<Municipio> {
        const municipio = await this.municipioRepository.findOne({
            where: { id }, relations: ["departamento"]
        });

        Object.assign(municipio, payload);

        municipio.update_at = new Date();
        municipio.user_create_id;

        return await this.municipioRepository.save(municipio);
    }

    async delete(id: number, userId: number): Promise<Municipio> {
        const municipio = await this.municipioRepository.findOne({
            where: { id },
            relations: ["departamento"],
        });

        if (!municipio) {
            throw new NotFoundException("Municipio no encontrado");
        }

        municipio.deleted_at = new Date()
        municipio.deleted_at_id = userId;

        return await this.municipioRepository.save(municipio)
    }
}