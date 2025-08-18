import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Municipio } from "../entities/municipio.entity";
import { Repository } from "typeorm";
import { Utilities } from "../../../common/helpers/utilities";
import { createMunicipioDto } from "../dtos/municipio.dto";

@Injectable()
export class MunicipioService {
    constructor(
        @InjectRepository(Municipio)
        private municipioRepository: Repository<Municipio>,
    ) {}

    async create(Payload: createMunicipioDto): Promise<Municipio> {
        try {
            const municipio = await this.municipioRepository.create(Payload)
            return await this.municipioRepository.save(municipio);
        } catch (error) {
            Utilities.catchError (error)
        }
    }

    async findOne (id: number): Promise<Municipio> {
        try {
            const municipio = await this.municipioRepository.findOne({where: { id }, relations: ["departamento"]});
            return municipio;
        } catch (error) {
            Utilities.catchError (error)
        }
    }

    async findAll(): Promise<Municipio[]> {
        try {

            const municipio = await this.municipioRepository.find({relations: ["departamento"]});
            return municipio; 
        } catch (error) {
            Utilities.catchError (error)
        }
    }

    async update(id: number, payload: Partial<Municipio>): Promise<Municipio> {
        try {
            const municipio = await this.municipioRepository.findOne({
                where: { id } ,relations: ["departamento"]
            });

            Object.assign(municipio, payload);

            municipio.update_at = new Date ();
            municipio.user_create_id;

            return await this.municipioRepository.save(municipio);
        } catch (error) {
            Utilities.catchError (error)
        }
    }

    async delete(id: number, userId: number): Promise<Municipio> {
        try {
            const municipio = await this.municipioRepository.findOne({ 
                where: {id} ,relations: ["semestre"]
            });

            municipio.deleted_at = new Date()
            municipio.deleted_at_id = userId;

            return await this.municipioRepository.save(municipio)
        } catch (error) {
            Utilities.catchError (error)
        }
    }
}