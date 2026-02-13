import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
    const rolName = payload.rol?.trim();
    const existing = await this.roleRepo.findOne({
      where: { rol: rolName },
      withDeleted: true,
    });

    if (existing) {
      if (existing.deleteAt) {
        await this.roleRepo.restore(existing.id);
        const reactivated = await this.roleRepo.save({
          ...existing,
          rol: rolName,
          isActive: payload.isActive ?? true,
          deleteAt: null,
        });
        return reactivated;
      }

      throw new ConflictException('Role already exists');
    }

    const newRole = this.roleRepo.create({
      ...payload,
      rol: rolName,
      isActive: payload.isActive ?? true,
    });
    return await this.roleRepo.save(newRole);
  }

  async updateRole(id: number, payload: RoleDto): Promise<Role> {
    const existingRole = await this.roleRepo.findOne({ where: { id } });
    if (!existingRole) {
      throw new NotFoundException("Role doesn't exist");
    }

    const rolName = payload.rol?.trim();
    if (rolName) {
      const duplicate = await this.roleRepo.findOne({
        where: { rol: rolName },
        withDeleted: true,
      });

      if (duplicate && Number(duplicate.id) !== Number(id)) {
        if (duplicate.deleteAt) {
          throw new ConflictException(
            'Deleted role exists with that name. Restore it or choose another name.',
          );
        }
        throw new ConflictException('Role already exists');
      }
    }

    const role = await this.roleRepo.preload({ id, ...payload, rol: rolName });
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
