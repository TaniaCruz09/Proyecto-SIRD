import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthDto } from '../dtos/auth.dto';

import { JwtService } from '@nestjs/jwt';
import { UserService } from './users.service';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersServices: UserService,
    private readonly jwtService: JwtService,
  ) { }
  async signIn(payload: AuthDto) {
    try {
      const { email, password } = payload;

      const user = await this.usersServices.findByEmail(email);
      // if (!user) {
      //   throw new UnauthorizedException('Usuario no encontrado');
      // }

      // Comparar contraseñas
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      // Generar el token
      const payloadJwt = { sub: user.id, name: user.name };
      const token = await this.jwtService.signAsync(payloadJwt);

      // Limpiar el objeto user (remover token antes de devolverlo)
      const { token: __, ...cleanUser } = user;

      return { user: cleanUser, token };
    } catch (error) {
      // Si el usuario no existe, atrapamos el NotFound y lo convertimos en 401
      if (error?.getStatus?.() === 404) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      // Si ya era un Unauthorized, lo dejamos pasar
      if (error?.getStatus?.() === 401) {
        throw error;
      }

      console.error('Error en login:', error); // Para depurar en consola
      throw new InternalServerErrorException('Error interno del servidor');
    }

  }
}