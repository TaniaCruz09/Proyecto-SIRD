import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { describe, expect, it } from '@jest/globals';
import { UserRole } from '../enums';
import { UserSelfOrAdminGuard } from './user-self-or-admin.guard';

describe('UserSelfOrAdminGuard', () => {
  const guard = new UserSelfOrAdminGuard();

  const createContext = (user: unknown, requestedId: string) =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          user,
          params: { id: requestedId },
        }),
      }),
    }) as ExecutionContext;

  it('allows a user to read their own profile', () => {
    const user = {
      id: 12,
      activeRole: UserRole.DOCENTE,
      roles: [{ rol: UserRole.DOCENTE }],
    };

    expect(guard.canActivate(createContext(user, '12'))).toBe(true);
  });

  it('allows an admin to read another user profile', () => {
    const user = {
      id: 1,
      activeRole: UserRole.ADMIN,
      roles: [{ rol: UserRole.ADMIN }],
    };

    expect(guard.canActivate(createContext(user, '12'))).toBe(true);
  });

  it('denies a user from reading another profile', () => {
    const user = {
      id: 12,
      activeRole: UserRole.DOCENTE,
      roles: [{ rol: UserRole.DOCENTE }],
    };

    expect(() => guard.canActivate(createContext(user, '13'))).toThrow(
      ForbiddenException,
    );
  });

  it('does not use an unselected admin role for authorization', () => {
    const user = {
      id: 12,
      activeRole: UserRole.DOCENTE,
      roles: [{ rol: UserRole.ADMIN }, { rol: UserRole.DOCENTE }],
    };

    expect(() => guard.canActivate(createContext(user, '13'))).toThrow(
      ForbiddenException,
    );
  });
});
