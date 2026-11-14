import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from '../entities';

/** Contenido del JWT que firma el login. */
type JwtPayload = {
  sub?: number;
  id?: number;
  name?: string;
  email?: string;
  roles?: string[];
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }
  async validate(payload: JwtPayload): Promise<User> {
    // Los tokens se firman con `sub` (id del usuario); `id` se mantiene como
    // respaldo para tokens antiguos.
    const userId = payload.sub ?? payload.id;
    if (!userId) throw new UnauthorizedException('El Token no es valido');

    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { roles: true },
    });
    if (!user) throw new UnauthorizedException('El Token no es valido');
    if (!user.isActive)
      throw new UnauthorizedException('El usuario no esta activo');

    return user;
  }
}
