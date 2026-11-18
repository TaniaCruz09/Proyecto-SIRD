import { BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash } from 'crypto';
import * as bcrypt from 'bcrypt';
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { UserService } from './users.service';

const sha256 = (value: string) =>
  createHash('sha256').update(value).digest('hex');

describe('UserService reset password', () => {
  const jwtService = new JwtService({ secret: 'reset-flow-test-secret' });

  const buildService = (stored: unknown) => {
    const saved: any[] = [];
    const userRepository = {
      createQueryBuilder: () => ({
        addSelect: () => ({
          where: () => ({ getOne: async () => stored }),
        }),
      }),
      manager: {
        transaction: async (callback: (manager: any) => Promise<unknown>) =>
          callback({
            save: async (_entity: unknown, entity: any) => {
              saved.push(entity);
              return entity;
            },
            update: async () => ({ affected: 1 }),
          }),
      },
    };

    const service = new UserService(
      userRepository as any,
      {} as any,
      jwtService,
      {} as any,
    );
    return { service, saved };
  };

  const resetToken = (code: string, sub = 9) =>
    jwtService.sign(
      { sub, action: 'reset', resetCodeHash: sha256(code) },
      { expiresIn: '15m' },
    );

  it('accepts the token once, hashes the password and clears the code', async () => {
    const { service, saved } = buildService({
      id: 9,
      resetCode: '123456',
      resetCodeExpire: new Date(Date.now() + 60_000),
    });

    await service.resetPassword(resetToken('123456'), 'ClaveSegura1');

    expect(saved).toHaveLength(1);
    expect(saved[0].resetCode).toBeNull();
    expect(saved[0].resetCodeExpire).toBeNull();
    expect(await bcrypt.compare('ClaveSegura1', saved[0].password)).toBe(true);
  });

  it('rejects a reused token after the code was cleared', async () => {
    const { service, saved } = buildService({
      id: 9,
      resetCode: null,
      resetCodeExpire: null,
    });

    await expect(
      service.resetPassword(resetToken('123456'), 'ClaveSegura1'),
    ).rejects.toThrow(BadRequestException);
    expect(saved).toHaveLength(0);
  });

  it('rejects a token whose code hash does not match the stored code', async () => {
    const { service } = buildService({
      id: 9,
      resetCode: '123456',
      resetCodeExpire: new Date(Date.now() + 60_000),
    });

    await expect(
      service.resetPassword(resetToken('999999'), 'ClaveSegura1'),
    ).rejects.toThrow(BadRequestException);
  });

  it('rejects a token issued for another purpose', async () => {
    const { service } = buildService({
      id: 9,
      resetCode: '123456',
      resetCodeExpire: new Date(Date.now() + 60_000),
    });
    const token = jwtService.sign({ sub: 9, activeRole: 'Admin' });

    await expect(service.resetPassword(token, 'ClaveSegura1')).rejects.toThrow(
      BadRequestException,
    );
  });
});

describe('UserService reset code delivery', () => {
  const originalTransport = process.env.MAIL_TRANSPORT;
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    if (originalTransport === undefined) delete process.env.MAIL_TRANSPORT;
    else process.env.MAIL_TRANSPORT = originalTransport;

    if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalNodeEnv;

    jest.restoreAllMocks();
  });

  const buildService = (user: Record<string, unknown>) => {
    const queryBuilder: any = {
      addSelect: () => queryBuilder,
      leftJoinAndSelect: () => queryBuilder,
      where: () => queryBuilder,
      getOne: async () => user,
    };
    const userRepository = {
      createQueryBuilder: () => queryBuilder,
      save: async (entity: unknown) => entity,
    };
    const mailer = { sendMail: jest.fn() };
    const service = new UserService(
      userRepository as any,
      {} as any,
      new JwtService({ secret: 'reset-code-test-secret' }),
      mailer as any,
    );

    return { service, mailer, user };
  };

  it('muestra el código en el log en vez de enviar correo con MAIL_TRANSPORT=console', async () => {
    process.env.MAIL_TRANSPORT = 'console';
    process.env.NODE_ENV = 'test';
    const { service, mailer, user } = buildService({
      id: 3,
      name: 'Test',
      email: 'test@example.com',
    });
    const logSpy = jest
      .spyOn(Logger, 'log')
      .mockImplementation(() => undefined);

    await service.generateResetCode('test@example.com');

    expect(mailer.sendMail).not.toHaveBeenCalled();
    expect(String(user.resetCode)).toHaveLength(6);
    expect(logSpy).toHaveBeenCalled();
  });

  it('envía el correo cuando MAIL_TRANSPORT no es console', async () => {
    process.env.MAIL_TRANSPORT = 'smtp';
    process.env.NODE_ENV = 'test';
    const { service, mailer } = buildService({
      id: 3,
      name: 'Test',
      email: 'test@example.com',
    });

    await service.generateResetCode('test@example.com');

    expect(mailer.sendMail).toHaveBeenCalledTimes(1);
  });

  it('ignora MAIL_TRANSPORT=console en producción', async () => {
    process.env.MAIL_TRANSPORT = 'console';
    process.env.NODE_ENV = 'production';
    const { service, mailer } = buildService({
      id: 3,
      name: 'Test',
      email: 'test@example.com',
    });

    await service.generateResetCode('test@example.com');

    expect(mailer.sendMail).toHaveBeenCalledTimes(1);
  });
});
