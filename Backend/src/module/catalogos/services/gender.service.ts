import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { GenderDto } from "../dtos/gender.dto";
import { GenderEntity } from "../entities/gender.entity";
import { Utilities } from "src/common/helpers/utilities";


@Injectable()
export class GenderService {
    constructor(
        @InjectRepository(GenderEntity)
        private readonly GenderRepo: Repository<GenderEntity>,
    ) { }

    async created(payload: GenderDto) {
        try {
            const gender = await this.GenderRepo.create(payload);
            return await this.GenderRepo.save(gender);
        } catch (error) {
            Utilities.catchError(error)
        }

    }

    async getGender() {
        try {
            const gender = await this.GenderRepo.find();
            return gender;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async getGenderById(id: number): Promise<GenderEntity> {
        try {
            const gender = await this.GenderRepo.findOne({
                where: { id },
            });
            return gender;
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async updateGender(id: number, payload: GenderDto): Promise<GenderEntity> {
        try {
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
        } catch (error) {
            Utilities.catchError(error)
        }
    }

    async deleteGender(id: number, userId: number): Promise<GenderEntity> {
        try {
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
        } catch (error) {
            Utilities.catchError(error)
        }
    }
}