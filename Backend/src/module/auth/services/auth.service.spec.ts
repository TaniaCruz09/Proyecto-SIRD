import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { describe, expect, it } from '@jest/globals';
import { AuthSession } from '../entities';
import { UserService } from './users.service';
import { AuthService } from './auth.service';
import { AUTH_TOKEN_TYPE } from '../auth-token';
import { Repository } from 'typeorm';

describe('AuthService role-selection tokens', () => {
  let storedSession: AuthSession | null = null;
  const sessionRepository = {
    save: async (session: AuthSession) => {
      storedSession = session;
      return session;
    },
    findOne: async ({ where }: { where: Partial<AuthSession> }) => {
      if (
        storedSession?.id === where.id &&
        storedSession.userId === where.userId
      ) {
        return storedSession;
      }
      return null;
    },
    update: async (
      where: Partial<AuthSession>,
      changes: Partial<AuthSession>,
    ) => {
      if (
        storedSession?.id === where.id &&
        storedSession.userId === where.userId
      ) {
        Object.assign(storedSession, changes);
        return { affected: 1 };
      }
      return { affected: 0 };
    },
  } as unknown as Repository<AuthSession>;
  const service = new AuthService(
    {} as UserService,
    new JwtService({ secret: 'auth-service-test-secret' }),
    sessionRepository,
  );
  const user = { id: 7, name: 'Test User', email: 'test@example.com' };

  it('creates a signed, short-lived token with only the role-selection purpose', async () => {
    const token = await service.createRoleSelectionToken(user);
    const payload = await service.verifyRoleSelectionToken(token);

    expect(payload.type).toBe(AUTH_TOKEN_TYPE.ROLE_SELECTION);
    expect(payload.sub).toBe(user.id);
    expect(payload.roles).toEqual([]);
    expect(payload.activeRole).toBeUndefined();
  });

  it('does not accept an access token for role selection', async () => {
    const token = await service.createAccessToken(user, 'Admin');

    await expect(service.verifyRoleSelectionToken(token)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('does not accept a role-selection token for protected access', async () => {
    const token = await service.createRoleSelectionToken(user);

    await expect(service.verifyAccessToken(token)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('does not accept an expired or malformed token', async () => {
    const expiredToken = await new JwtService({
      secret: 'auth-service-test-secret',
    }).signAsync(
      {
        sub: user.id,
        type: AUTH_TOKEN_TYPE.ROLE_SELECTION,
        roles: [],
        sessionStartedAt: Date.now(),
      },
      { expiresIn: -1 },
    );

    await expect(
      service.verifyRoleSelectionToken(expiredToken),
    ).rejects.toThrow(UnauthorizedException);
    await expect(
      service.verifyRoleSelectionToken('not-a-jwt'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('revokes a copied access token when its session is logged out', async () => {
    const token = await service.createAccessToken(user, 'Admin');

    await service.revokeToken(token);

    await expect(service.verifyAccessToken(token)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('invalidates the prior role token when the session switches roles', async () => {
    const oldToken = await service.createAccessToken(user, 'Docente');
    const payload = await service.verifyAccessToken(oldToken);
    const switchedToken = await service.createAccessToken(
      user,
      'Admin',
      payload.sessionStartedAt,
      payload.sid,
    );

    await expect(service.verifyAccessToken(oldToken)).rejects.toThrow(
      UnauthorizedException,
    );
    expect((await service.verifyAccessToken(switchedToken)).activeRole).toBe(
      'Admin',
    );
  });
});
