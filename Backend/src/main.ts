import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';
import { existsSync, mkdirSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api/v1')
  app.use(cookieParser());

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
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Asegurar que existan las carpetas de uploads (en producción no están versionadas)
  const uploadsDir = join(__dirname, '..', 'uploads');
  for (const folder of ['students', 'docentes']) {
    const dir = join(uploadsDir, folder);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  //Servir carpeta uploads de forma pública
  app.useStaticAssets(uploadsDir, {
    prefix: '/uploads',
  });

  const config = new DocumentBuilder()
    .setTitle('sird documentation')
    .setDescription('The sird API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('sird')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();