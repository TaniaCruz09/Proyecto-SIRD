import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { AcademicLevelDto } from "../dtos/academiclevel.dto";
import { AcademicLevelEntity } from "../entities/academiclevel.entity";
import { Utilities } from "src/common/helpers/utilities";

@Injectable()
export class AcademicLevelService {
  constructor(
    @InjectRepository(AcademicLevelEntity)
    private readonly AcademicLevelRepo: Repository<AcademicLevelEntity>,
  ) { }

  async created(payload: AcademicLevelDto) {
    try {
      const academicLevel = this.AcademicLevelRepo.create(payload);
      return await this.AcademicLevelRepo.save(academicLevel);
    } catch (error) {
      Utilities.catchError(error)
    }
  }

  async getAcademicLevel() {
    try {
      const academicLevels = await this.AcademicLevelRepo.find();
      return academicLevels;
    } catch (error) {
      Utilities.catchError(error)
    }
  }

  async getAcademicLevelById(id: number): Promise<AcademicLevelEntity> {
    try {
      const academicLevel = await this.AcademicLevelRepo.findOne({ where: { id } });
      return academicLevel;
    } catch (error) {
      Utilities.catchError(error)
    }
  }

  async updateAcademicLevel(id: number, payload: AcademicLevelDto): Promise<AcademicLevelEntity> {
    try {
      const academicLevel = await this.AcademicLevelRepo.findOne({ where: { id } })
      if (!academicLevel) {
        throw new NotFoundException("Profesión no encontrada");
      }
      Object.assign(academicLevel, payload);

      // Asignar la fecha de actualización y el usuario que modifica
      academicLevel.update_at = new Date();
      academicLevel.user_update_id;

      return await this.AcademicLevelRepo.save(academicLevel);
    } catch (error) {
      Utilities.catchError(error)
    }
  }

  async deleteAcademicLevel(id: number, userId: number): Promise<AcademicLevelEntity> {
    try {
      const academicLevel = await this.AcademicLevelRepo.findOne({ where: { id } });
      if (!academicLevel) {
        throw new NotFoundException("Profesión no encontrada");
      }

      // Registrar el usuario que eliminó y la fecha de eliminación
      academicLevel.deleted_at = new Date();
      academicLevel.deleted_at_id = userId;
      return await this.AcademicLevelRepo.save(academicLevel);
    } catch (error) {
      Utilities.catchError(error)
    }
  }
}
