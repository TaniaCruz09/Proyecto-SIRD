import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from '../entities';
import { AUTH_TOKEN_TYPE, AuthTokenPayload, MAX_SESSION_AGE_MS } from '../auth-token';
import { normalizeRoleName, roleMatches } from '../enums';
import { AuthService } from '../services/auth.service';

export type AuthenticatedUser = User & { activeRole: string };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => request?.cookies?.token ?? null,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
    });
  }
  async validate(payload: AuthTokenPayload): Promise<AuthenticatedUser> {
    if (
      payload.type !== AUTH_TOKEN_TYPE.ACCESS ||
      !Number.isInteger(payload.sub) ||
      typeof payload.sid !== 'string' ||
      !payload.activeRole ||
      !Array.isArray(payload.roles) ||
      !payload.roles.some((role) => roleMatches(role, payload.activeRole)) ||
      !Number.isFinite(payload.sessionStartedAt)
    ) {
      throw new UnauthorizedException('El token de acceso no es válido');
    }

    const sessionAge = Date.now() - payload.sessionStartedAt;
    if (sessionAge < 0 || sessionAge >= MAX_SESSION_AGE_MS) {
      throw new UnauthorizedException('La sesión ha expirado');
    }

    await this.authService.assertAccessSession(payload);

    const user = await this.userRepo.findOne({
      where: { id: payload.sub },
      relations: { roles: true },
    });
    if (!user) throw new UnauthorizedException('El Token no es valido');
    if (!user.isActive)
      throw new UnauthorizedException('El usuario no esta activo');

    const activeRole = user.roles?.find((role) =>
      roleMatches(role.rol, payload.activeRole),
    );
    if (!activeRole) {
      throw new UnauthorizedException('El rol de la sesión ya no está asignado');
    }

    return Object.assign(user, {
      activeRole: normalizeRoleName(activeRole.rol),
      roles: [activeRole],
    });
  }
}
