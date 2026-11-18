import { Injectable, NotFoundException } from '@nestjs/common';

import { DataSource, IsNull } from 'typeorm';
import { AuthSession, Role, User } from '../entities';
import { UserHasRolesDto } from '../dtos/user-has-roles';


@Injectable()
export class AsignarRolesService {
  constructor(private readonly dataSource: DataSource) {}

  async asignarRol(userId: number, payload: UserHasRolesDto) {
    const roles = await this.getNewsRolesByIds(payload.roles, userId);
    const user = await this.dataSource
      .getRepository(User)
      .findOne({ where: { id: userId }, relations: { roles: true } });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const currentRoles = user.roles ?? [];
    const asignar = [...currentRoles, ...roles];

    user.roles = asignar;

    await this.dataSource.transaction(async (manager) => {
      await manager.save(User, user);
      if (roles.length) {
        await manager.update(
          AuthSession,
          { userId, revokedAt: IsNull() },
          { revokedAt: new Date() },
        );
      }
    });

// Recargar usuario con roles ya asignados
const updatedUser = await this.dataSource.getRepository(User).findOne({
  where: { id: userId },
  relations: { roles: true },
});

return updatedUser;
  }

  async removerRol(userId: number, payload: UserHasRolesDto) {
    const roles = await this.getAllRolesByIds(payload.roles);
    const user = await this.dataSource
      .getRepository(User)
      .findOne({ where: { id: userId }, relations: { roles: true } });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const currentRoles = user.roles ?? [];
    const remover = currentRoles.filter((role) => {
      return !roles.find((r) => r.id === role.id);
    });
    const rolesChanged = remover.length !== currentRoles.length;

    user.roles = remover;

    return await this.dataSource.transaction(async (manager) => {
      const saved = await manager.save(User, user);
      if (rolesChanged) {
        await manager.update(
          AuthSession,
          { userId, revokedAt: IsNull() },
          { revokedAt: new Date() },
        );
      }
      return saved;
    });
  }

  async getNewsRolesByIds(roles: number[], userId: number): Promise<Role[]> {
    const list = this.dataSource
      .getRepository(Role)
      .createQueryBuilder('role')
      .where('role.id in (:...roles)', { roles })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select(
            `
          case 
			      when "user_roles"."role_id" > 0 then "user_roles"."role_id"
		        else 0
	        end
          `,
          )
          .from(User, 'user')
          .leftJoin('user.roles', 'roles')
          .where('user.id = :id', { id: userId })
          .getQuery();

        return 'role.id not in ' + subQuery;
      });

    return await list.getMany();
  }

  async getAllRolesByIds(roles: number[]): Promise<Role[]> {
    const list = this.dataSource
      .getRepository(Role)
      .createQueryBuilder('role')
      .where('role.id in (:...roles)', { roles });

    return await list.getMany();
  }

  async verUsuarioConRoles(userId: number): Promise<{ id: number; nombre: string; roles: Role[] }> {
  const user = await this.dataSource.getRepository(User).findOne({
    where: { id: userId },
    relations: { roles: true },
  });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  return {
    id: user.id,
    nombre: user.name, // Aquí usamos el campo "name"
    roles: user.roles,
  };
}

}
