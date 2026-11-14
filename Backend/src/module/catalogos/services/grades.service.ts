import { Repository, IsNull } from "typeorm";
import { GradesDto } from "../dtos/grades.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { GradesEntity } from "../entities/grades.entity";
import { Grupos } from "src/module/organizacionEscolar/entities/grupos.entity";

@Injectable()
export class GradesService {
    constructor(
        @InjectRepository(GradesEntity)
        private readonly GradesRepo: Repository<GradesEntity>,
        @InjectRepository(Grupos)
        private readonly gruposRepo: Repository<Grupos>,
    ) { }

    async created(payload: GradesDto) {
        const grades = await this.GradesRepo.create(payload);
        return await this.GradesRepo.save(grades);

    }

    async getGrades() {
        const grades = await this.GradesRepo.find({
            where: { deleted_at: IsNull() },
        });
        return grades;
    }

    async getGradesById(id: number): Promise<GradesEntity> {
        const grades = await this.GradesRepo.findOne({
            where: { id, deleted_at: IsNull() },
        });
        return grades;
    }

    async updateGrades(id: number, payload: GradesDto): Promise<GradesEntity> {
        const grades = await this.GradesRepo.preload({ id, ...payload });
        return await this.GradesRepo.save(grades)
    }

    async deleteGrades(id: number, userId: number): Promise<GradesEntity> {
        const grades = await this.GradesRepo.findOne({
            where: { id },
            relations: ['grupos'],
        });

        if (!grades) {
            throw new NotFoundException('Grado no encontrado');
        }

        // Soft delete de todos los grupos relacionados
        if (grades.grupos && grades.grupos.length > 0) {
            const now = new Date();
            for (const grupo of grades.grupos) {
                await this.gruposRepo.update(grupo.id, {
                    deleted_at: now,
                    deleted_at_id: userId,
                });
            }
        }

        // Soft delete del grado
        grades.deleted_at = new Date();
        grades.deleted_at_id = userId;
        return await this.GradesRepo.save(grades);
    }
}