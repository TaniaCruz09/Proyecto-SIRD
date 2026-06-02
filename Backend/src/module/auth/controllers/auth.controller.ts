import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  HttpStatus,
  HttpException,
  Req,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthDto } from '../dtos/auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../services';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) { }

  @Post('login')
  async signIn(
    @Body() payload: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { user, token } = await this.authService.signIn(payload);

      const roles = user.roles?.map((r: any) => r.rol) || [];

      // Caso 1: un solo rol → token definitivo
      if (roles.length === 1) {
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        });

        return { user, roles, autoSelectRole: true };
      }

      // Caso 2: múltiples roles → token básico
      if (roles.length > 1) {
        const basicToken = await this.authService.createBasicToken(user);

        res.cookie('token', basicToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        });

        return { user, roles, autoSelectRole: false };
      }

      // Caso 3: sin roles
      return {
        message: 'El usuario no tiene roles asignados',
      };
    } catch (error: any) {
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message =
        error.response?.message || error.message || 'Error de login';
      throw new HttpException({ message }, status);
    }
  }

  @Post('select-role')
  async selectRole(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: { role: string },
  ) {
    const { role } = body;
    if (!role) {
      throw new BadRequestException('Debe seleccionar un rol');
    }

    try {
      const token = req.cookies?.token;
      if (!token) {
        throw new BadRequestException('No hay token válido');
      }

      // Decodificar token básico
      const payload = this.jwtService.decode(token) as any;
      if (!payload) {
        throw new BadRequestException('Token inválido');
      }

      // 🔁 Volver a buscar el usuario completo en la BD
      const user = await this.authService.findUserById(payload.sub);
      if (!user) throw new BadRequestException('Usuario no encontrado');

      // Buscar el rol seleccionado dentro de sus roles
      const selectedRole = user.roles.find((r) => r.rol === role);
      if (!selectedRole) {
        throw new BadRequestException('El rol seleccionado no pertenece al usuario');
      }

      // Crear token completo con rol + datos extra
      const newToken = this.jwtService.sign({
        sub: user.id,
        name: user.name,
        email: user.email,
        roles: [role],
        docente: user.docente ? { id: user.docente.id, nombre: user.docente.nombres } : null,
      });

      res.cookie('token', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return {
        message: 'Rol seleccionado correctamente',
        role,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          docente: user.docente,
        },
      };
    } catch (err) {
      console.error('Error en /auth/select-role:', err);
      throw new BadRequestException('Error al seleccionar rol');
    }
  }


  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    // Limpiar la cookie 'token'
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // solo HTTPS en producción
      sameSite: 'lax',
      path: '/',
    });

    return {
      message: 'Sesión cerrada correctamente',
    };
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.token;
    if (!token) throw new UnauthorizedException('No hay token');

    try {
      const payload = this.jwtService.verify(token) as any;

      const newToken = this.jwtService.sign({
        sub: payload.sub,
        name: payload.name,
        email: payload.email,
        roles: payload.roles,
        docente: payload.docente ?? null,
      });

      res.cookie('token', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return { message: 'Sesion renovada' };
    } catch {
      throw new UnauthorizedException('Token invalido o expirado');
    }
  }

  @Get('me')
  async getMe(@Req() req: Request) {
    const token = req.cookies['token'];
    if (!token) throw new UnauthorizedException('No hay token');

    try {
      const payload = this.jwtService.verify(token);
      return {
        user: {
          id: payload.sub,
          name: payload.name,
          email: payload.email,
          roles: payload.roles,
        },
      };
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }
    //--------------------------------------------------------------
//----------------- RUTAS PARA RECUPERAR CONTRASEÑA -----------------
 @Post('request-reset')
async requestReset(@Body('email') email: string) {
  return await this.userService.generateResetCode(email);
}


@Post('verify-code')
async verifyCode(@Body() body: { email: string; code: string }) {
  const result = await this.userService.verifyResetCode(body.email, body.code);

  // Devuelve solo lo necesario
  return { token: result.token }; // ✅ objeto plano sin referencias circulares
}
@Post('reset-password')
async resetPassword(@Body() body: { token: string; newPassword: string }) {
  return await this.userService.resetPassword(body.token, body.newPassword);
}

//--------------------------------------------------------------
  @Get('test')
  @UseGuards(AuthGuard())
  test() {
    return 'test';
  }
}
