import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Departamento } from "../entities/departamento.entity";
import { Repository } from "typeorm";
import { CreateDepartamentoDto } from "../dtos/departamento.dto";

@Injectable()
export class DepartamentoService {
    constructor(
        @InjectRepository(Departamento)
        private readonly departamentoRepository: Repository<Departamento>,
    ) { }
    //Departamento a createDepartamentoDto
    async create(payload: CreateDepartamentoDto): Promise<Departamento> {
        const departamento = await this.departamentoRepository.create(payload)
        return await this.departamentoRepository.save(departamento);
    }

    async findOne(id: number): Promise<Departamento> {
        const departamento = await this.departamentoRepository.findOne({ where: { id } });
        return departamento;
    }

    async findAll(): Promise<Departamento[]> {
        const municipio = await this.departamentoRepository.find();
        return municipio;
    }

    async update(id: number, payload: Partial<Departamento>): Promise<Departamento> {
        const departamento = await this.departamentoRepository.findOne({
            where: { id }
        });

        Object.assign(departamento, payload);

        departamento.update_at = new Date();
        departamento.user_update_id;

        return await this.departamentoRepository.save(departamento);
    }

    async delete(id: number, userId: number): Promise<Departamento> {
        const departamento = await this.departamentoRepository.findOne({
            where: { id }
        });

        if (!departamento) {
            throw new NotFoundException('Departamento no encontrado');
        }

        departamento.deleted_at = new Date()
        departamento.deleted_at_id = userId;

        return await this.departamentoRepository.save(departamento)
    }
}