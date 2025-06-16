import { Injectable } from '@nestjs/common';

import { DataSource } from 'typeorm';
import { Role, User } from '../entities';
import { UserHasRolesDto } from '../dtos/user-has-roles';


@Injectable()
export class AsignarRolesService {
  constructor(private readonly dataSource: DataSource) {}

  async asignarRol(userId: number, payload: UserHasRolesDto) {
    const roles = await this.getNewsRolesByIds(payload.roles, userId);
    const user = await this.dataSource
      .getRepository(User)
      .findOne({ where: { id: userId }, relations: { roles: true } });

    const asignar = [...user.roles, ...roles];

    user.roles = asignar;

    const saved = await this.dataSource.getRepository(User).save(user);
    return saved;
  }

  async removerRol(userId: number, payload: UserHasRolesDto) {
    const roles = await this.getAllRolesByIds(payload.roles);
    const user = await this.dataSource
      .getRepository(User)
      .findOne({ where: { id: userId }, relations: { roles: true } });

    const remover = user.roles.filter((role) => {
      return !roles.find((r) => r.id === role.id);
    });

    user.roles = remover;

    const saved = await this.dataSource.getRepository(User).save(user);
    return saved;
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
