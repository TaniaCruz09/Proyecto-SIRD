import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { AuthDto } from '../dtos/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { UserService } from './users.service';
import { normalizeRoleName, roleMatches } from '../enums';
import { AuthSession } from '../entities';
import {
  AUTH_TOKEN_TYPE,
  AuthTokenPayload,
  MAX_SESSION_AGE_MS,
  ROLE_SELECTION_TTL_MS,
} from '../auth-token';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersServices: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(AuthSession)
    private readonly sessionRepository: Repository<AuthSession>,
  ) { }
  async signIn(payload: AuthDto) {
    try {
      const { email, password } = payload;

      const user = await this.usersServices.findByEmail(email);

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      if (!user.isActive) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      const roles = (user.roles ?? [])
        .map((role) => normalizeRoleName(role.rol))
        .filter(Boolean);

      const {
        token: __token,
        password: __password,
        resetCode: __resetCode,
        resetCodeExpire: __resetCodeExpire,
        ...cleanUser
      } = user;

      return { user: cleanUser, roles };
    } catch (error: any) {
      if (error?.getStatus?.() === 404) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      if (error?.getStatus?.() === 401) {
        throw error;
      }

      console.error('Error en login:', error);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async createRoleSelectionToken(user: {
    id: number;
    name: string;
    email: string;
  }): Promise<string> {
    const sessionId = randomUUID();
    const sessionStartedAt = Date.now();
    await this.sessionRepository.save({
      id: sessionId,
      userId: user.id,
      activeRole: null,
      sessionStartedAt: new Date(sessionStartedAt),
      expiresAt: new Date(sessionStartedAt + ROLE_SELECTION_TTL_MS),
      revokedAt: null,
    });

    return this.jwtService.signAsync(
      {
        sub: user.id,
        sid: sessionId,
        name: user.name,
        email: user.email,
        type: AUTH_TOKEN_TYPE.ROLE_SELECTION,
        roles: [],
        sessionStartedAt,
      },
      { expiresIn: Math.floor(ROLE_SELECTION_TTL_MS / 1000) },
    );
  }

  async createAccessToken(
    user: { id: number; name: string; email: string },
    role: string,
    sessionStartedAt = Date.now(),
    sessionId?: string,
  ): Promise<string> {
    const sessionStarted = sessionId ? sessionStartedAt : Date.now();
    const id = sessionId ?? randomUUID();
    const now = Date.now();

    if (sessionId) {
      const session = await this.sessionRepository.findOne({
        where: { id, userId: user.id },
      });
      if (
        !session ||
        session.revokedAt ||
        session.expiresAt.getTime() <= now ||
        Math.abs(session.sessionStartedAt.getTime() - sessionStarted) > 1
      ) {
        throw new UnauthorizedException('La sesión ya no es válida');
      }

      session.activeRole = role;
      session.expiresAt = new Date(sessionStarted + MAX_SESSION_AGE_MS);
      await this.sessionRepository.save(session);
    } else {
      await this.sessionRepository.save({
        id,
        userId: user.id,
        activeRole: role,
        sessionStartedAt: new Date(sessionStarted),
        expiresAt: new Date(sessionStarted + MAX_SESSION_AGE_MS),
        revokedAt: null,
      });
    }

    return this.jwtService.signAsync({
      sub: user.id,
      sid: id,
      name: user.name,
      email: user.email,
      type: AUTH_TOKEN_TYPE.ACCESS,
      activeRole: role,
      roles: [role],
      sessionStartedAt: sessionStarted,
    });
  }

  async verifyToken(
    token: string,
    ignoreExpiration = false,
  ): Promise<AuthTokenPayload> {
    try {
      return await this.jwtService.verifyAsync<AuthTokenPayload>(token, {
        ignoreExpiration,
      });
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  async verifyRoleSelectionToken(token: string): Promise<AuthTokenPayload> {
    const payload = await this.verifyToken(token);
    const age = Date.now() - payload.sessionStartedAt;
    if (
      payload.type !== AUTH_TOKEN_TYPE.ROLE_SELECTION ||
      !Number.isInteger(payload.sub) ||
      typeof payload.sid !== 'string' ||
      !Array.isArray(payload.roles) ||
      payload.roles.length !== 0 ||
      payload.activeRole !== undefined ||
      !Number.isFinite(payload.sessionStartedAt) ||
      age < 0 ||
      age >= ROLE_SELECTION_TTL_MS
    ) {
      throw new UnauthorizedException('Token de selección inválido');
    }

    const session = await this.sessionRepository.findOne({
      where: { id: payload.sid, userId: payload.sub },
    });
    if (
      !session ||
      session.revokedAt ||
      session.activeRole !== null ||
      session.expiresAt.getTime() <= Date.now() ||
      Math.abs(session.sessionStartedAt.getTime() - payload.sessionStartedAt) > 1
    ) {
      throw new UnauthorizedException('La sesión de selección ya no es válida');
    }
    return payload;
  }

  async verifyAccessToken(token: string): Promise<AuthTokenPayload> {
    const payload = await this.verifyToken(token);
    const sessionAge = Date.now() - payload.sessionStartedAt;
    if (
      payload.type !== AUTH_TOKEN_TYPE.ACCESS ||
      !Number.isInteger(payload.sub) ||
      typeof payload.sid !== 'string' ||
      !payload.activeRole ||
      !Array.isArray(payload.roles) ||
      !payload.roles.some((role) => roleMatches(role, payload.activeRole)) ||
      !Number.isFinite(payload.sessionStartedAt) ||
      sessionAge < 0 ||
      sessionAge >= MAX_SESSION_AGE_MS
    ) {
      throw new UnauthorizedException('Token de acceso inválido o expirado');
    }
    await this.assertAccessSession(payload);
    return payload;
  }

  async assertAccessSession(payload: AuthTokenPayload): Promise<void> {
    const session = await this.sessionRepository.findOne({
      where: { id: payload.sid, userId: payload.sub },
    });
    if (
      !session ||
      session.revokedAt ||
      !session.activeRole ||
      !roleMatches(session.activeRole, payload.activeRole) ||
      session.expiresAt.getTime() <= Date.now() ||
      Math.abs(session.sessionStartedAt.getTime() - payload.sessionStartedAt) > 1
    ) {
      throw new UnauthorizedException('La sesión fue revocada o expiró');
    }
  }

  async revokeToken(token: string): Promise<void> {
    const payload = await this.verifyToken(token, true);
    if (!Number.isInteger(payload.sub) || typeof payload.sid !== 'string') {
      throw new UnauthorizedException('Token inválido');
    }
    await this.sessionRepository.update(
      { id: payload.sid, userId: payload.sub, revokedAt: IsNull() },
      { revokedAt: new Date() },
    );
  }

  async findUserById(id: number) {
    return await this.usersServices.getUserById(id);
  }

}