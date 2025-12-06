import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities';
import { RoleDto } from '../dtos/roles.dto';
import { QueryParamsRolesDto } from '../dtos/query-params-roles.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async getRolesById(id: number): Promise<Role> {
    const role = await this.roleRepo.findOne({
      where: { id },
    });

    return role;
  }

  async getRoles(query: QueryParamsRolesDto): Promise<Role[]> {
    const rows = this.roleRepo.createQueryBuilder('pepito').where('id <> 0');
    

    if (query.role)
      rows.andWhere('pepito.role ILIKE :role', { role: `%${query.role}%` });

    if (query.is_active === 'true')
      rows.andWhere('pepito.is_active = :is_active', {
        is_active: true,
      });

    if (query.is_active === 'false')
      rows.andWhere('pepito.is_active = :is_active', {
        is_active: false,
      });

    rows.orderBy('pepito.id', 'ASC');

    return await rows.getMany();
  }

  async createRole(payload: RoleDto): Promise<Role> {
    const newRole = this.roleRepo.create(payload);
    return await this.roleRepo.save(newRole);
  }

  async updateRole(id: number, payload: RoleDto): Promise<Role> {
    const role = await this.roleRepo.preload({ id, ...payload });
    return await this.roleRepo.save(role);
  }

  async deleteRole(id: number): Promise<Role> {
    const role = await this.getRolesById(id);
    if (!role) {
      throw new NotFoundException("Role doesn't exist");
    }
    const deleted = await this.roleRepo.softDelete({ id: id });

    return role;
  }
}
