import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  Req,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  Header,
  ServiceUnavailableException,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthDto } from '../dtos/auth.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { UserService } from '../services';
import { normalizeRoleName, roleMatches } from '../enums';
import { Public } from '../../../common/decorators/public.decorator';
import {
  AUTH_TOKEN_TYPE,
  ROLE_SELECTION_TTL_MS,
} from '../auth-token';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) { }

  // Cookie compartida entre dominios (frontend en Vercel ↔ backend en Render):
  // en producción se usa sameSite 'none' para que el navegador la envíe cross-site.
  private readonly cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'lax' | 'none',
    path: '/',
    maxAge: 2 * 60 * 60 * 1000,
  };

  @Public()
  @Header('Cache-Control', 'no-store')
  @Post('login')
  async signIn(
    @Body() payload: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, roles } = await this.authService.signIn(payload);
    if (!roles.length) {
      throw new ForbiddenException('El usuario no tiene roles asignados');
    }

    const autoSelectRole = roles.length === 1;
    const token = autoSelectRole
      ? await this.authService.createAccessToken(user, roles[0])
      : await this.authService.createRoleSelectionToken(user);

    res.cookie(
      'token',
      token,
      autoSelectRole
        ? this.cookieOptions
        : {
            ...this.cookieOptions,
            maxAge: ROLE_SELECTION_TTL_MS,
          },
    );

    return { user, roles, autoSelectRole };
  }

  @Public()
  @Header('Cache-Control', 'no-store')
  @Post('select-role')
  async selectRole(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: { role?: unknown },
  ) {
    const role = body?.role;
    if (typeof role !== 'string' || !role.trim()) {
      throw new BadRequestException('Debe seleccionar un rol');
    }

    const token = req.cookies?.token;
    if (!token) {
      throw new UnauthorizedException('No hay token de selección');
    }

    const pendingToken =
      await this.authService.verifyRoleSelectionToken(token);
    const user = await this.authService.findUserById(pendingToken.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario no válido');
    }

    const selectedRole = user.roles.find((r) =>
      roleMatches(r.rol, role.trim()),
    );
    if (!selectedRole) {
      throw new ForbiddenException(
        'El rol seleccionado no pertenece al usuario',
      );
    }

    const roleName = normalizeRoleName(selectedRole.rol);
    const accessToken = await this.authService.createAccessToken(
      user,
      roleName,
      pendingToken.sessionStartedAt,
      pendingToken.sid,
    );
    res.cookie('token', accessToken, this.cookieOptions);

    return {
      message: 'Rol seleccionado correctamente',
      role: roleName,
      roles: (user.roles ?? [])
        .map((assignedRole) => normalizeRoleName(assignedRole.rol))
        .filter(Boolean),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        docente: user.docente,
      },
    };
  }


  @Public()
  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const token = req.cookies?.token;
      if (token) await this.authService.revokeToken(token);
    } catch (error) {
      if (!(error instanceof UnauthorizedException)) throw error;
    } finally {
      res.clearCookie('token', this.cookieOptions);
    }

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

    const payload = await this.authService.verifyAccessToken(token);

    const user = await this.authService.findUserById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    const activeRole = user.roles.find((role) =>
      roleMatches(role.rol, payload.activeRole),
    );
    if (!activeRole) {
      throw new UnauthorizedException('El rol de la sesión ya no está asignado');
    }

    const accessToken = await this.authService.createAccessToken(
      user,
      normalizeRoleName(activeRole.rol),
      payload.sessionStartedAt,
      payload.sid,
    );
    res.cookie('token', accessToken, this.cookieOptions);

    return { message: 'Sesión renovada' };
  }

  @Public()
  @Header('Cache-Control', 'no-store')
  @Post('switch-role')
  async switchRole(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: { role?: unknown },
  ) {
    const role = body?.role;
    if (typeof role !== 'string' || !role.trim()) {
      throw new BadRequestException('Debe seleccionar un rol');
    }

    const token = req.cookies?.token;
    if (!token) throw new UnauthorizedException('No hay una sesión activa');

    const payload = await this.authService.verifyAccessToken(token);
    const user = await this.authService.findUserById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario no válido');
    }

    const assignedRoles = user.roles ?? [];
    if (
      !assignedRoles.some((assignedRole) =>
        roleMatches(assignedRole.rol, payload.activeRole),
      )
    ) {
      throw new UnauthorizedException('El rol actual ya no está asignado');
    }

    const selectedRole = assignedRoles.find((assignedRole) =>
      roleMatches(assignedRole.rol, role.trim()),
    );
    if (!selectedRole) {
      throw new ForbiddenException(
        'El rol seleccionado no pertenece al usuario',
      );
    }

    const roleName = normalizeRoleName(selectedRole.rol);
    const accessToken = await this.authService.createAccessToken(
      user,
      roleName,
      payload.sessionStartedAt,
      payload.sid,
    );
    res.cookie('token', accessToken, this.cookieOptions);

    return {
      message: 'Rol cambiado correctamente',
      role: roleName,
      roles: assignedRoles.map((assignedRole) =>
        normalizeRoleName(assignedRole.rol),
      ),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        docente: user.docente,
      },
    };
  }

  @Public()
  @Header('Cache-Control', 'no-store')
  @Get('me')
  async getMe(@Req() req: Request) {
    const token = req.cookies['token'];
    if (!token) throw new UnauthorizedException('No hay token');

    const tokenType = await this.authService.verifyToken(token);
    if (tokenType.type === AUTH_TOKEN_TYPE.ROLE_SELECTION) {
      const payload =
        await this.authService.verifyRoleSelectionToken(token);
      const user = await this.authService.findUserById(payload.sub);
      if (!user || !user.isActive) {
        throw new UnauthorizedException('Token inválido');
      }

      return {
        roleSelectionRequired: true,
        roles: (user.roles ?? [])
          .map((role) => normalizeRoleName(role.rol))
          .filter(Boolean),
        user: { id: user.id, name: user.name, email: user.email },
      };
    }

    const payload = await this.authService.verifyAccessToken(token);
    const user = await this.authService.findUserById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Token inválido');
    }

    if (
      !(user.roles ?? []).some((role) =>
        roleMatches(role.rol, payload.activeRole),
      )
    ) {
      throw new UnauthorizedException('El rol de la sesión ya no está asignado');
    }

    const activeRole = normalizeRoleName(payload.activeRole);
    return {
      roleSelectionRequired: false,
      activeRole,
      roles: (user.roles ?? [])
        .map((role) => normalizeRoleName(role.rol))
        .filter(Boolean),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        docente: user.docente,
      },
    };
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
    if (error instanceof NotFoundException) {
      // respuesta genérica más abajo
    } else if (this.isMailDeliveryError(error)) {
      throw new ServiceUnavailableException(
        'No se pudo enviar el correo de recuperación. Intenta de nuevo más tarde.',
      );
    } else {
      throw error;
    }
  }

  return {
    message: 'Si el correo está registrado, recibirás un código de verificación',
  };
}

  /** Credenciales SMTP rechazadas o cuenta sin permiso para enviar. */
  private isMailDeliveryError(error: unknown): boolean {
    const candidate = error as { code?: unknown; responseCode?: unknown };
    return (
      candidate?.code === 'EAUTH' ||
      candidate?.responseCode === 535 ||
      candidate?.responseCode === 534
    );
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
async resetPassword(@Body() body: ResetPasswordDto) {
  return await this.userService.resetPassword(body.token, body.newPassword);
}

//--------------------------------------------------------------
  @Get('test')
  @UseGuards(AuthGuard())
  test() {
    return 'test';
  }
}
