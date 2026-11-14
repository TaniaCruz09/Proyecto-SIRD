import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfessionsDto } from '../dtos/professions.dto';
import { ProfessionsEntity } from '../entities/professions.entity';

@Injectable()
export class ProfessionsService {
  constructor(
    @InjectRepository(ProfessionsEntity)
    private readonly ProfessionsRepo: Repository<ProfessionsEntity>,
  ) {}

  async created(payload: ProfessionsDto) {
    const profession = await this.ProfessionsRepo.create(payload);
    return await this.ProfessionsRepo.save(profession);
  }

      async getProfessions(): Promise<ProfessionsEntity[]>{
        const profession = await this.ProfessionsRepo.find();
        return profession;
        
      }
      

  async getProfessionsById(id: number): Promise<ProfessionsEntity> {
    const profession = await this.ProfessionsRepo.findOne({
      where: { id },
    });

    return profession;
  }

  /*async updateProfession(id: number, updateprofesionDTO: Partial<ProfessionsEntity>): Promise<ProfessionsEntity> {
              const profesion = await this.ProfessionsRepo.preload({
                  id,
                  ...updateprofesionDTO,
              });
              return await this.ProfessionsRepo.save(profesion);
    }*/
  /* async updateProfession(id: number, updateprofesionDTO: Partial<ProfessionsEntity>): Promise<ProfessionsEntity> {
                const profesion = await this.ProfessionsRepo.preload({
                    id,
                    ...updateprofesionDTO,
                });

                if (!profesion) {
                    throw new NotFoundException("Profesión no encontrada");
                }

                return await this.ProfessionsRepo.save(profesion);
            }*/

  async updateProfession(
    id: number,
    payload: ProfessionsDto,
  ): Promise<ProfessionsEntity> {
    const profession = await this.ProfessionsRepo.findOne({ where: { id } });

    if (!profession) {
      throw new NotFoundException('Profesión no encontrada');
    }

    // Actualizar solo los campos enviados, conservando los valores previos
    Object.assign(profession, payload);

    // Asignar la fecha de actualización y el usuario que modifica
    profession.update_at = new Date();
    profession.user_update_id;

    return await this.ProfessionsRepo.save(profession);
  }

  /* async deleteProfession (id:number): Promise<ProfessionsEntity> {

        const profession = await this.ProfessionsRepo.findOne({
          where: {id: id}
        });

        return await this.ProfessionsRepo.remove(profession);
      }*/

  async deleteProfession(
    id: number,
    userId: number,
  ): Promise<ProfessionsEntity> {
    const profession = await this.ProfessionsRepo.findOne({ where: { id } });

    if (!profession) {
      throw new NotFoundException('Profesión no encontrada');
    }

    // Registrar el usuario que eliminó y la fecha de eliminación
    profession.deleted_at = new Date();
    profession.deleted_at_id = userId;

    return await this.ProfessionsRepo.save(profession); // Guardar los cambios
  }
}
