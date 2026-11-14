import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { roleMatches, UserRole } from '../enums';

@Injectable()
export class UserSelfOrAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User | undefined;
    const requestedUserId = Number(request.params?.id);

    if (!user) {
      throw new ForbiddenException('Usuario no autorizado');
    }

    const isAdmin = (user.roles ?? []).some((role) =>
      roleMatches(role.rol, UserRole.ADMIN),
    );

    if (isAdmin || user.id === requestedUserId) {
      return true;
    }

    throw new ForbiddenException(
      'Solo puedes consultar tu propio usuario',
    );
  }
}
