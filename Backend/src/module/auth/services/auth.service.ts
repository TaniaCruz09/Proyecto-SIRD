import {
  Body,
  Injectable,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthDto } from '../dtos/auth.dto';

import { JwtService } from '@nestjs/jwt';
import { UserService } from './users.service';
import { normalizeRoleName } from '../enums';


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

      // Un usuario desactivado no puede iniciar sesión.
      if (!user.isActive) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      // Generar el token (roles con nombre canónico: 'docente' -> 'Docente')
      const payloadJwt = {
        sub: user.id,
        name: user.name,
        email: user.email,
        roles: (user.roles ?? []).map((role) => normalizeRoleName(role.rol)),
      };
      const token = await this.jwtService.signAsync(payloadJwt);

      // Limpiar el objeto user: nunca devolver datos sensibles al cliente
      const {
        token: __token,
        password: __password,
        resetCode: __resetCode,
        resetCodeExpire: __resetCodeExpire,
        ...cleanUser
      } = user;

      return { user: cleanUser, token };
    } catch (error: any) {
      // Si el usuario no existe, atrapamos el NotFound y lo convertimos en 401
      if (error?.getStatus?.() === 404) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      // Si ya era un Unauthorized, lo dejamos pasar
      if (error?.getStatus?.() === 401) {
        throw error;
      }

      console.error('Error en login:', error); // Para depurar en consola
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  // 👉 NUEVO MÉTODO: genera un token "básico" sin roles
  async createBasicToken(user: any) {
    const payloadJwt = {
      sub: user.id,
      name: user.name,
      email: user.email,
      roles: [], // vacío hasta que elija rol en /select-role
    };
    return this.jwtService.sign(payloadJwt);
  }

  async findUserById(id: number) {
    return await this.usersServices.getUserById(id);
  }

}