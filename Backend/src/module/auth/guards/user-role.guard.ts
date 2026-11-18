import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { META_ROLES } from '../decorators/role.decorator';
import { roleMatches, USER_ROLES, UserRole } from '../enums';
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

    const req = context.switchToHttp().getRequest();
    const user = req.user as (User & { activeRole?: string }) | undefined;

    if (!user?.activeRole) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    const isReadOnly = READ_METHODS.includes(
      String(req.method ?? 'GET').toUpperCase(),
    );

    if (adminWrite && !isReadOnly) {
      if (!roleMatches(user.activeRole, UserRole.ADMIN)) {
        throw new ForbiddenException(
          `User ${user.name} need a valid role: [${UserRole.ADMIN}]`,
        );
      }
    }

    const allowedRoles = validRoles?.length ? validRoles : USER_ROLES;
    if (allowedRoles.some((role) => roleMatches(user.activeRole, role))) {
      return true;
    }

    throw new ForbiddenException(
      `User ${user.name} need a valid role: [${allowedRoles}]`,
    );
  }
}
