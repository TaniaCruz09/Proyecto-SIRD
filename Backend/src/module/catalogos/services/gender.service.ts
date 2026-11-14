import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { GenderDto } from "../dtos/gender.dto";
import { GenderEntity } from "../entities/gender.entity";

@Injectable()
export class GenderService {
    constructor(
        @InjectRepository(GenderEntity)
        private readonly GenderRepo: Repository<GenderEntity>,
    ) { }

    async created(payload: GenderDto) {
        const gender = await this.GenderRepo.create(payload);
        return await this.GenderRepo.save(gender);

    }

    async getGender() {
        const gender = await this.GenderRepo.find();
        return gender;
    }

    async getGenderById(id: number): Promise<GenderEntity> {
        const gender = await this.GenderRepo.findOne({
            where: { id },
        });
        return gender;
    }

    async updateGender(id: number, payload: GenderDto): Promise<GenderEntity> {
        const gender = await this.GenderRepo.findOne({ where: { id } });

        if (!gender) {
            throw new NotFoundException("genero no encontrada");
        }

        // Actualizar solo los campos enviados, conservando los valores previos
        Object.assign(gender, payload);

        // Asignar la fecha de actualización y el usuario que modifica
        gender.update_at = new Date();
        gender.user_update_id;

        return await this.GenderRepo.save(gender)
    }

    async deleteGender(id: number, userId: number): Promise<GenderEntity> {
        const gender = await this.GenderRepo.findOne({
            where: { id: id }
        })
        if (!gender) {
            throw new NotFoundException("Profesión no encontrada");
        }

        // Registrar el usuario que eliminó y la fecha de eliminación
        gender.deleted_at = new Date();
        gender.deleted_at_id = userId;
        return await this.GenderRepo.save(gender);
    }
}