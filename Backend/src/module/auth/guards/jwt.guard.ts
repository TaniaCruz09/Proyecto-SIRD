import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../../../common/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        // Las rutas marcadas con @Public() (login, refresh, healthcheck) no exigen token.
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const tokenFromCookie = request.cookies?.token; // <--- aquí lee la cookie

        // La cookie solo se usa si el cliente no envió un Bearer explícito.
        if (tokenFromCookie && !request.headers.authorization) {
            request.headers.authorization = `Bearer ${tokenFromCookie}`;
        }

        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        if (err || !user) {
            throw err || new UnauthorizedException('Usuario no autenticado');
        }
        return user;
    }
}
