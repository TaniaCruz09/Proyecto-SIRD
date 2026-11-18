import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { AuthenticatedUser } from '../strategies/jwt.strategy';
import { roleMatches, UserRole } from '../enums';

@Injectable()
export class UserSelfOrAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser | undefined;
    const requestedUserId = Number(request.params?.id);

    if (!user) {
      throw new ForbiddenException('Usuario no autorizado');
    }

    const isAdmin = roleMatches(user.activeRole, UserRole.ADMIN);

    if (isAdmin || user.id === requestedUserId) {
      return true;
    }

    throw new ForbiddenException(
      'Solo puedes consultar tu propio usuario',
    );
  }
}
