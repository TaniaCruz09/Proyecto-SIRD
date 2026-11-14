import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { AcademicLevelDto } from "../dtos/academiclevel.dto";
import { AcademicLevelEntity } from "../entities/academiclevel.entity";

@Injectable()
export class AcademicLevelService {
  constructor(
    @InjectRepository(AcademicLevelEntity)
    private readonly AcademicLevelRepo: Repository<AcademicLevelEntity>,
  ) { }

  async created(payload: AcademicLevelDto) {
    const academicLevel = this.AcademicLevelRepo.create(payload);
    return await this.AcademicLevelRepo.save(academicLevel);
  }

  async getAcademicLevel() {
    const academicLevels = await this.AcademicLevelRepo.find();
    return academicLevels;
  }

  async getAcademicLevelById(id: number): Promise<AcademicLevelEntity> {
    const academicLevel = await this.AcademicLevelRepo.findOne({ where: { id } });
    return academicLevel;
  }

  async updateAcademicLevel(id: number, payload: AcademicLevelDto): Promise<AcademicLevelEntity> {
    const academicLevel = await this.AcademicLevelRepo.findOne({ where: { id } })
    if (!academicLevel) {
      throw new NotFoundException("Profesión no encontrada");
    }
    Object.assign(academicLevel, payload);

    // Asignar la fecha de actualización y el usuario que modifica
    academicLevel.update_at = new Date();
    academicLevel.user_update_id;

    return await this.AcademicLevelRepo.save(academicLevel);
  }

  async deleteAcademicLevel(id: number, userId: number): Promise<AcademicLevelEntity> {
    const academicLevel = await this.AcademicLevelRepo.findOne({ where: { id } });
    if (!academicLevel) {
      throw new NotFoundException("Profesión no encontrada");
    }

    // Registrar el usuario que eliminó y la fecha de eliminación
    academicLevel.deleted_at = new Date();
    academicLevel.deleted_at_id = userId;
    return await this.AcademicLevelRepo.save(academicLevel);
  }
}
