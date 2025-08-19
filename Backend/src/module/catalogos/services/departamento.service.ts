import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Departamento } from "../entities/departamento.entity";
import { Repository } from "typeorm";
import { Utilities } from "../../../common/helpers/utilities";
import { CreateDepartamentoDto } from "../dtos/departamento.dto";


@Injectable()
export class DepartamentoService {
    constructor(
        @InjectRepository(Departamento)
        private readonly departamentoRepository: Repository<Departamento>,
    ) { }
    //Departamento a createDepartamentoDto
    async create(payload: CreateDepartamentoDto): Promise<Departamento> {
        try {
            const departamento = await this.departamentoRepository.create(payload)
            return await this.departamentoRepository.save(departamento);
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async findOne(id: number): Promise<Departamento> {
        try {
            const departamento = await this.departamentoRepository.findOne({ where: { id } });
            return departamento;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async findAll(): Promise<Departamento[]> {
        try {
            const municipio = await this.departamentoRepository.find();
            return municipio;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async update(id: number, payload: Partial<Departamento>): Promise<Departamento> {
        try {
            const departamento = await this.departamentoRepository.findOne({
                where: { id }
            });

            Object.assign(departamento, payload);

            departamento.update_at = new Date();
            departamento.user_update_id;

            return await this.departamentoRepository.save(departamento);
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async delete(id: number, userId: number): Promise<Departamento> {
        try {
            const departamento = await this.departamentoRepository.findOne({
                where: { id }
            });

            departamento.deleted_at = new Date()
            departamento.deleted_at_id = userId;

            return await this.departamentoRepository.save(departamento)

        } catch (error) {
            Utilities.catchError(error)
        }
    }
}