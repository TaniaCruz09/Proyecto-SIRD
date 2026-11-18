import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { describe, expect, it, jest } from '@jest/globals';
import { UserRole } from '../enums';
import { UserRoleGuard } from './user-role.guard';

describe('UserRoleGuard', () => {
  const createContext = (user: unknown) =>
    ({
      getHandler: () => ({}),
      getClass: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({ user, method: 'GET' }),
      }),
    }) as ExecutionContext;

  it('authorizes using only the selected role', () => {
    const reflector = {
      getAllAndOverride: jest
        .fn()
        .mockReturnValueOnce(false)
        .mockReturnValueOnce([UserRole.ADMIN])
        .mockReturnValueOnce(false),
    } as unknown as Reflector;
    const guard = new UserRoleGuard(reflector);
    const user = {
      name: 'User',
      activeRole: UserRole.DOCENTE,
      roles: [{ rol: UserRole.ADMIN }, { rol: UserRole.DOCENTE }],
    };

    expect(() => guard.canActivate(createContext(user))).toThrow(
      ForbiddenException,
    );
  });

  it('only allows known system roles on routes without explicit role metadata', () => {
    const reflector = {
      getAllAndOverride: jest
        .fn()
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(undefined)
        .mockReturnValueOnce(false),
    } as unknown as Reflector;
    const guard = new UserRoleGuard(reflector);

    expect(
      guard.canActivate(
        createContext({ name: 'Teacher', activeRole: UserRole.DOCENTE }),
      ),
    ).toBe(true);

    const customRoleReflector = {
      getAllAndOverride: jest
        .fn()
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(undefined)
        .mockReturnValueOnce(false),
    } as unknown as Reflector;
    const customRoleGuard = new UserRoleGuard(customRoleReflector);

    expect(() =>
      customRoleGuard.canActivate(
        createContext({ name: 'User', activeRole: 'CustomRole' }),
      ),
    ).toThrow(ForbiddenException);
  });
});
