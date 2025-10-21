import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Utilities } from "../../../common/helpers/utilities";
import { EsquelaHeadEntity } from "./entities/squela_head.entity";
import { EsquelaHeadDto } from "./dto/esquela_head.dto";


@Injectable()
export class EsquelaHeadService {
    constructor(
        @InjectRepository(EsquelaHeadEntity)
        private esquelaHeadRepository: Repository<EsquelaHeadEntity>,
    ) { }

    async create(Payload: EsquelaHeadDto): Promise<EsquelaHeadEntity> {
        try {
            const esquelaHead = await this.esquelaHeadRepository.create(Payload)
            return await this.esquelaHeadRepository.save(esquelaHead);
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async findOne(id: number): Promise<EsquelaHeadEntity> {
        try {
            const esquelaHead = await this.esquelaHeadRepository.findOne({ where: { id }, relations: ["grupo_asignatura", 'grupo_asignatura.grupoAsignaturaDocente.asignatura'] });
            return esquelaHead;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async findAll(): Promise<EsquelaHeadEntity[]> {
        try {
            const municipio = await this.esquelaHeadRepository.find({ relations: ["grupo_asignatura", 'grupo_asignatura.grupoAsignaturaDocente.asignatura'] });
            return municipio;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async update(id: number, payload: Partial<EsquelaHeadEntity>): Promise<EsquelaHeadEntity> {
        try {
            const esquelaHead = await this.esquelaHeadRepository.findOne({
                where: { id }, relations: ["grupo_asignatura"]
            });

            Object.assign(esquelaHead, payload);

            esquelaHead.update_at = new Date();
            esquelaHead.user_create_id;

            return await this.esquelaHeadRepository.save(esquelaHead);
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async delete(id: number, userId: number): Promise<EsquelaHeadEntity> {
        try {
            const esquelaHead = await this.esquelaHeadRepository.findOne({
                where: { id }, relations: ["grupo_asignatura"]
            });

            esquelaHead.deleted_at = new Date()
            esquelaHead.deleted_at_id = userId;

            return await this.esquelaHeadRepository.save(esquelaHead)
        } catch (error) {
            Utilities.catchError(error)
        }
    }
}