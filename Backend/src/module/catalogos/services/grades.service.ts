import { Repository, IsNull } from "typeorm";
import { GradesDto } from "../dtos/grades.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { GradesEntity } from "../entities/grades.entity";
import { Utilities } from "src/common/helpers/utilities";
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
        try {
            const grades = await this.GradesRepo.create(payload);
            return await this.GradesRepo.save(grades);
        } catch (error) {
            Utilities.catchError(error)
        }

    }

    async getGrades() {
        try {
            const grades = await this.GradesRepo.find({
                where: { deleted_at: IsNull() },
            });
            return grades;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async getGradesById(id: number): Promise<GradesEntity> {
        try {
            const grades = await this.GradesRepo.findOne({
                where: { id, deleted_at: IsNull() },
            });
            return grades;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async updateGrades(id: number, payload: GradesDto): Promise<GradesEntity> {
        try {
            const grades = await this.GradesRepo.preload({ id, ...payload });
            return await this.GradesRepo.save(grades)
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async deleteGrades(id: number, userId: number): Promise<GradesEntity> {
        try {
            const grades = await this.GradesRepo.findOne({
                where: { id },
                relations: ['grupos'],
            });

            if (!grades) {
                throw new Error('Grado no encontrado');
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
        } catch (error) {
            Utilities.catchError(error)
        }
    }
}