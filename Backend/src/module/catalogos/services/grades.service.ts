import { Repository } from "typeorm";
import { GradesDto } from "../dtos/grades.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { GradesEntity } from "../entities/grades.entity";
import { Utilities } from "src/common/helpers/utilities";


@Injectable()
export class GradesService {
    constructor(
        @InjectRepository(GradesEntity)
        private readonly GradesRepo: Repository<GradesEntity>,
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
            const grades = await this.GradesRepo.find();
            return grades;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async getGradesById(id: number): Promise<GradesEntity> {
        try {
            const grades = await this.GradesRepo.findOne({
                where: { id },
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

    async deleteGrades(id: number): Promise<GradesEntity> {
        try {
            const grades = await this.GradesRepo.findOne({
                where: { id: id }
            })
            return await this.GradesRepo.remove(grades);
        } catch (error) {
            Utilities.catchError(error)
        }
    }
}