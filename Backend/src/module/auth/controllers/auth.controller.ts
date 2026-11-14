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
  NotFoundException,
  Header,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthDto } from '../dtos/auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../services';
import { normalizeRoleName, roleMatches } from '../enums';
import { Public } from '../../../common/decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) { }

  // Cookie compartida entre dominios (frontend en Vercel ↔ backend en Render):
  // en producción se usa sameSite 'none' para que el navegador la envíe cross-site.
  private readonly cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'lax' | 'none',
    path: '/',
  };

  @Public()
  @Header('Cache-Control', 'no-store')
  @Post('login')
  async signIn(
    @Body() payload: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { user, token } = await this.authService.signIn(payload);

      // Nombres de rol con capitalización canónica ('docente' -> 'Docente')
      const roles = user.roles?.map((r: any) => normalizeRoleName(r.rol)).filter(Boolean) || [];

      // Caso 1: un solo rol → token definitivo
      if (roles.length === 1) {
        res.cookie('token', token, this.cookieOptions);

        return { user, roles, autoSelectRole: true, token };
      }

      // Caso 2: múltiples roles → token básico
      if (roles.length > 1) {
        const basicToken = await this.authService.createBasicToken(user);

        res.cookie('token', basicToken, this.cookieOptions);

        return { user, roles, autoSelectRole: false, token: basicToken };
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

  @Public()
  @Header('Cache-Control', 'no-store')
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

      // Buscar el rol seleccionado dentro de sus roles (sin importar mayúsculas/minúsculas)
      const selectedRole = user.roles.find((r) => roleMatches(r.rol, role));
      if (!selectedRole) {
        throw new BadRequestException('El rol seleccionado no pertenece al usuario');
      }

      const roleName = normalizeRoleName(selectedRole.rol);

      // Crear token completo con rol + datos extra
      const newToken = this.jwtService.sign({
        sub: user.id,
        name: user.name,
        email: user.email,
        roles: [roleName],
        docente: user.docente ? { id: user.docente.id, nombre: user.docente.nombres } : null,
      });

      res.cookie('token', newToken, this.cookieOptions);

      return {
        message: 'Rol seleccionado correctamente',
        role: roleName,
        token: newToken,
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


  @Public()
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    // Limpiar la cookie 'token'
    res.clearCookie('token', this.cookieOptions);

    return {
      message: 'Sesión cerrada correctamente',
    };
  }

  @Public()
  @Header('Cache-Control', 'no-store')
  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.token;
    if (!token) throw new UnauthorizedException('No hay token');

    try {
      const payload = this.jwtService.verify(token) as any;

      // Verificar que el usuario siga existiendo y activo antes de renovar.
      const user = await this.authService.findUserById(payload.sub);
      if (!user || !user.isActive) {
        throw new UnauthorizedException('Token invalido o expirado');
      }

      const roles = user.roles?.length
        ? user.roles.map((role) => normalizeRoleName(role.rol))
        : (payload.roles ?? []).map((r: string) => normalizeRoleName(r));

      const newToken = this.jwtService.sign({
        sub: user.id,
        name: user.name,
        email: user.email,
        roles,
        docente: payload.docente ?? null,
      });

      res.cookie('token', newToken, this.cookieOptions);

      return { message: 'Sesion renovada', token: newToken };
    } catch {
      throw new UnauthorizedException('Token invalido o expirado');
    }
  }

  @Public()
  @Header('Cache-Control', 'no-store')
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
          roles: (payload.roles ?? []).map((r: string) => normalizeRoleName(r)),
        },
      };
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }
    //--------------------------------------------------------------
//----------------- RUTAS PARA RECUPERAR CONTRASEÑA -----------------
 @Public()
 @Post('request-reset')
async requestReset(@Body('email') email: string) {
  if (!email || typeof email !== 'string') {
    throw new BadRequestException('El correo es obligatorio');
  }

  try {
    await this.userService.generateResetCode(email.trim());
  } catch (error) {
    // Solo se oculta el caso "correo no registrado" (evita enumerar usuarios).
    // Otros fallos (por ejemplo SMTP) sí se informan.
    if (!(error instanceof NotFoundException)) throw error;
  }

  return {
    message: 'Si el correo está registrado, recibirás un código de verificación',
  };
}


@Public()
@Post('verify-code')
async verifyCode(@Body() body: { email: string; code: string }) {
  if (!body?.email || !body?.code) {
    throw new BadRequestException('Correo y código son obligatorios');
  }

  const result = await this.userService.verifyResetCode(
    body.email.trim(),
    String(body.code).trim(),
  );

  // Devuelve solo lo necesario
  return { token: result.token }; // ✅ objeto plano sin referencias circulares
}
@Public()
@Post('reset-password')
async resetPassword(@Body() body: { token: string; newPassword: string }) {
  if (!body?.token || !body?.newPassword) {
    throw new BadRequestException('Token y contraseña son obligatorios');
  }
  return await this.userService.resetPassword(body.token, body.newPassword);
}

//--------------------------------------------------------------
  @Get('test')
  @UseGuards(AuthGuard())
  test() {
    return 'test';
  }
}
