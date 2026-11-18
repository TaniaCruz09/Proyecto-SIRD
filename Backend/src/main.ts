import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DataSource } from 'typeorm';
import { basename } from 'path';
import cookieParser = require('cookie-parser');
import { mkdirSync } from 'fs';
import {
  ensureUploadDir,
  getUploadsRoot,
  UPLOAD_SUBFOLDERS,
} from './common/uploads/uploads-root';
import { securityHeaders } from './common/security/security-headers.middleware';
import { authRateLimit } from './common/security/auth-rate-limit.middleware';
import { AuthService } from './module/auth/services/auth.service';
import { roleMatches } from './module/auth/enums';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api/v1')
  app.disable('x-powered-by');
  // Render (y cualquier proxy) envía X-Forwarded-For; necesario para el rate limit.
  app.set('trust proxy', 1);
  app.use(cookieParser());
  app.use(securityHeaders);

  // Orígenes permitidos por CORS (separados por coma).
  // Ej: "http://localhost:3000,https://mi-app.vercel.app"
  const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: corsOrigins,
    credentials: true, // permite cookies httpOnly
  });
  app.use((req, res, next) => {
    const method = (req.method ?? 'GET').toUpperCase();
    const hasCookieSession = Boolean(req.cookies?.token);
    if (
      hasCookieSession &&
      !['GET', 'HEAD', 'OPTIONS'].includes(method) &&
      !corsOrigins.includes(req.get('origin') ?? '')
    ) {
      res.status(403).json({
        statusCode: 403,
        message: 'Origen de solicitud no permitido',
      });
      return;
    }
    next();
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // El contador compartido en PostgreSQL se aplica igual en todas las instancias.
  app.use(
    '/api/v1/auth',
    authRateLimit(
      app.get(DataSource),
      app.get(ConfigService).getOrThrow<string>('JWT_SECRET'),
    ),
  );

  // Asegurar que existan las carpetas de uploads (en producción no están versionadas).
  // Todas cuelgan de la misma raíz absoluta, independiente del CWD.
  mkdirSync(getUploadsRoot(), { recursive: true });
  for (const folder of UPLOAD_SUBFOLDERS) {
    ensureUploadDir(folder);
  }
  Logger.log(`Carpeta de archivos subidos: ${getUploadsRoot()}`, 'Uploads');

  // Descarga forzada de un archivo: /uploads/<ruta>?download=1
  app.use('/uploads', (req, res, next) => {
    if (req.query?.download !== undefined) {
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${basename(decodeURIComponent(req.path))}"`,
      );
    }
    next();
  });

  // Servir carpeta uploads.
  // Por defecto los archivos siguen siendo públicos (comportamiento actual).
  // Define PROTECT_UPLOADS=true para exigir sesión válida (recomendado, ya que
  // los expedientes contienen datos personales).
  if (process.env.PROTECT_UPLOADS === 'true') {
    const authService = app.get(AuthService);

    app.use('/uploads', (req, res, next) => {
      const header = req.headers.authorization;
      const token =
        req.cookies?.token ??
        (typeof header === 'string' && header.startsWith('Bearer ')
          ? header.slice(7)
          : undefined);

      if (!token) {
        res.status(401).json({ statusCode: 401, message: 'No autenticado' });
        return;
      }

      void authService
        .verifyAccessToken(token)
        .then(async (payload) => {
          const user = await authService.findUserById(payload.sub);
          const activeRoleAssigned = user?.roles?.some((role) =>
            roleMatches(role.rol, payload.activeRole),
          );
          if (!user?.isActive || !activeRoleAssigned) {
            res.status(401).json({
              statusCode: 401,
              message: 'Sesión inválida',
            });
            return;
          }
          next();
        })
        .catch((error: unknown) => {
          if (error instanceof UnauthorizedException) {
            res.status(401).json({
              statusCode: 401,
              message: 'Token inválido o expirado',
            });
            return;
          }
          next(error);
        });
    });
  }

  app.useStaticAssets(getUploadsRoot(), {
    prefix: '/uploads',
  });

  // Swagger solo en desarrollo (o si se habilita explícitamente).
  const swaggerEnabled =
    process.env.NODE_ENV !== 'production' ||
    process.env.SWAGGER_ENABLED === 'true';

  if (swaggerEnabled) {
    const config = new DocumentBuilder()
      .setTitle('sird documentation')
      .setDescription('The sird API description')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('sird')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, documentFactory);
  }

  app.enableShutdownHooks();

  await app.listen(process.env.PORT || 3000);
}
bootstrap();