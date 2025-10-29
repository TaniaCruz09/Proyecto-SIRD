import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const tokenFromCookie = request.cookies?.token; // <--- aquí lee la cookie

        if (tokenFromCookie) {
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
