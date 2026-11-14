import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { NotaCualitativa } from "../entities/notaCualitativa.entity";
import { NotaCualitativaDto } from "../dtos/notaCualitativa.dto";

@Injectable()
export class NotaCualitativaService {
  constructor(
    @InjectRepository(NotaCualitativa)
    private readonly notaCualitativaRepo: Repository<NotaCualitativa>,
  ) {}

  async created(payload: NotaCualitativaDto) {
    const nota = this.notaCualitativaRepo.create(payload);
    return await this.notaCualitativaRepo.save(nota);
  }

  async getNotasCualitativas() {
    return await this.notaCualitativaRepo.find();
  }

  async getNotaCualitativaById(id: number): Promise<NotaCualitativa> {
    return await this.notaCualitativaRepo.findOne({ where: { id } });
  }

  async updateNotaCualitativa(id: number, payload: NotaCualitativaDto): Promise<NotaCualitativa> {
    const nota = await this.notaCualitativaRepo.findOne({ where: { id } });
    if (!nota) {
      throw new NotFoundException("Nota cualitativa no encontrada");
    }
    Object.assign(nota, payload);

    nota.update_at = new Date();
    nota.user_update_id;

    return await this.notaCualitativaRepo.save(nota);
  }

  async deleteNotaCualitativa(id: number, userId: number): Promise<NotaCualitativa> {
    const nota = await this.notaCualitativaRepo.findOne({ where: { id } });
    if (!nota) {
      throw new NotFoundException("Nota cualitativa no encontrada");
    }

    nota.deleted_at = new Date();
    nota.deleted_at_id = userId;

    return await this.notaCualitativaRepo.save(nota);
  }
}
