import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Asignatura } from "../entities/asignatura.entity";
import { Repository } from "typeorm";
import { CreateAsignaturaDto } from "../dtos/asignatura.dto";

@Injectable()
export class AsignaturaService {
    constructor(
        @InjectRepository(Asignatura)
        private readonly asignaturaRepository: Repository<Asignatura>,
    ) { }

    // Funcion para crear asignatura
    // Asignatira por createAsignaturaDto
    async create(payload: CreateAsignaturaDto): Promise<Asignatura> {
        const asignatura = await this.asignaturaRepository.create(payload);
        return await this.asignaturaRepository.save(asignatura);
    }

    // Funcion para buscar una asignatura por su id
    async findOne(id: number): Promise<Asignatura> {
        const asignatura = await this.asignaturaRepository.findOne({ where: { id } });
        return asignatura;
    }

    async findAll(): Promise<Asignatura[]> {
        const asignatura = await this.asignaturaRepository.find();
        return asignatura;
    }

    async update(id: number, payload: Partial<Asignatura>): Promise<Asignatura> {
        const asignatura = await this.asignaturaRepository.findOne({
            where: { id }
        });

        Object.assign(asignatura, payload);

        asignatura.update_at = new Date();
        asignatura.user_update_id;

        return await this.asignaturaRepository.save(asignatura);
    }

    async delete(id: number, userId: number): Promise<Asignatura> {
        const asignatura = await this.asignaturaRepository.findOne({
            where: { id }
        });

        if (!asignatura) {
            throw new NotFoundException('Asignatura no encontrada');
        }

        asignatura.deleted_at = new Date()
        asignatura.deleted_at_id = userId;

        return await this.asignaturaRepository.save(asignatura)

    }
}