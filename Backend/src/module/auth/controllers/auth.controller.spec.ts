import { ForbiddenException } from '@nestjs/common';
import { Request, Response } from 'express';
import { describe, expect, it, jest } from '@jest/globals';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/users.service';
import { AuthController } from './auth.controller';

describe('AuthController role switching', () => {
  const sessionStartedAt = Date.now();
  const user = {
    id: 12,
    name: 'Test User',
    email: 'test@example.com',
    isActive: true,
    roles: [{ rol: 'Admin' }, { rol: 'Docente' }],
    docente: null,
  };
  const payload = {
    sub: user.id,
    sid: 'a0fca2a0-793f-4787-8fa0-f9c6adef3532',
    type: 'access' as const,
    activeRole: 'Docente',
    roles: ['Docente'],
    sessionStartedAt,
  };

  const createController = (roles = user.roles) => {
    const accessTokenCalls: Array<[typeof user, string, number, string]> = [];
    const authService = {
      verifyAccessToken: async () => payload,
      findUserById: async () => ({ ...user, roles }),
      createAccessToken: async (
        targetUser: typeof user,
        role: string,
        startedAt: number,
        sessionId: string,
      ) => {
        accessTokenCalls.push([targetUser, role, startedAt, sessionId]);
        return 'new-signed-token';
      },
    };
    const controller = new AuthController(
      authService as unknown as AuthService,
      {} as UserService,
    );
    const request = {
      cookies: { token: 'current-signed-token' },
    } as unknown as Request;
    const response = { cookie: jest.fn() } as unknown as Response;

    return { controller, authService, accessTokenCalls, request, response };
  };

  it('issues a new cookie for another role already assigned to the user', async () => {
    const { controller, accessTokenCalls, request, response } =
      createController();

    const result = await controller.switchRole(
      request,
      response,
      { role: 'Admin' },
    );

    expect(accessTokenCalls).toEqual([
      [
        expect.objectContaining({ id: user.id }),
        'Admin',
        sessionStartedAt,
        payload.sid,
      ],
    ]);
    expect(response.cookie).toHaveBeenCalledWith(
      'token',
      'new-signed-token',
      expect.objectContaining({ httpOnly: true }),
    );
    expect(result.role).toBe('Admin');
    expect(result.roles).toEqual(['Admin', 'Docente']);
  });

  it('rejects a role that is not assigned to the user', async () => {
    const { controller, accessTokenCalls, request, response } =
      createController([{ rol: 'Docente' }]);

    await expect(
      controller.switchRole(request, response, { role: 'Admin' }),
    ).rejects.toThrow(ForbiddenException);
    expect(accessTokenCalls).toHaveLength(0);
  });
});
