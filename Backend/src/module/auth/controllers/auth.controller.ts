import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  HttpStatus,
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

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
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
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          message:
            error.response?.message || error.message || 'Error de login',
        });
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

      const payload = this.jwtService.decode(token) as any;
      if (!payload) {
        throw new BadRequestException('Token inválido');
      }

      // Crear token definitivo con rol seleccionado
      const newToken = this.jwtService.sign({
        sub: payload.sub,
        name: payload.name,
        email: payload.email,
        roles: [role],
      });

      console.log("Nuevo token generado:", newToken);

      res.cookie('token', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return { message: 'Rol seleccionado correctamente', role, payload };
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

  @Get('test')
  @UseGuards(AuthGuard())
  test() {
    return 'test';
  }
}
