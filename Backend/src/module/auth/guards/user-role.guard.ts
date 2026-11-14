import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { META_ROLES } from '../decorators/role.decorator';
import { roleMatches, UserRole } from '../enums';
import { IS_PUBLIC_KEY } from '../../../common/decorators/public.decorator';
import { ADMIN_WRITE_KEY } from '../../../common/decorators/admin-write.decorator';

const READ_METHODS = ['GET', 'HEAD', 'OPTIONS'];

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Las rutas públicas no tienen usuario y no deben evaluar roles.
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const validRoles: string[] = this.reflector.getAllAndOverride(META_ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);

    // @AdminWrite(): solo bloquea las operaciones que modifican datos.
    const adminWrite = this.reflector.getAllAndOverride<boolean>(
      ADMIN_WRITE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!validRoles?.length && !adminWrite) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user) throw new BadRequestException('User not found');

    const isReadOnly = READ_METHODS.includes(
      String(req.method ?? 'GET').toUpperCase(),
    );

    if (adminWrite && !isReadOnly) {
      const isAdmin = (user.roles ?? []).some((role) =>
        roleMatches(role.rol, UserRole.ADMIN),
      );

      if (!isAdmin) {
        throw new ForbiddenException(
          `User ${user.name} need a valid role: [${UserRole.ADMIN}]`,
        );
      }
    }

    if (!validRoles?.length) return true;

    for (const role of user.roles ?? []) {
      if (validRoles.some((validRole) => roleMatches(role.rol, validRole))) {
        return true;
      }
    }

    throw new ForbiddenException(
      `User ${user.name} need a valid role: [${validRoles}]`,
    );
  }
}
