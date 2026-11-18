import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import {
  RolesService,
  UserService,
  AsignarRolesService,
  AuthService,
} from './services';
import {
  AuthController,
  RolesController,
  UsersController,
  AsignarRolesController,
} from './controllers';
import { AuthRateLimitBucket, AuthSession, User, Role } from './entities';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, AuthSession, AuthRateLimitBucket]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '2h',
          },
        };
      },
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const user = config.get<string>('GMAIL_USER')?.trim() ?? '';
        const rawPass = config.get<string>('GMAIL_PASS')?.trim() ?? '';
        const host = config.get<string>('SMTP_HOST')?.trim() || 'smtp.gmail.com';
        // Google muestra la contraseña de aplicación como "abcd efgh ijkl mnop":
        // si se pega con espacios, la autenticación falla con 535.
        const pass =
          host === 'smtp.gmail.com' ? rawPass.replace(/\s+/g, '') : rawPass;
        const port = Number(config.get<string>('SMTP_PORT') ?? 587);
        const secure = config.get<string>('SMTP_SECURE')?.trim() === 'true';
        const fromAddress = config.get<string>('MAIL_FROM')?.trim() || user;
        const transportMode =
          config.get<string>('MAIL_TRANSPORT')?.trim().toLowerCase() || 'smtp';
        const isProduction = config.get<string>('NODE_ENV') === 'production';

        if (transportMode === 'console') {
          Logger.warn(
            isProduction
              ? 'MAIL_TRANSPORT=console se ignora en producción: se usará SMTP.'
              : 'MAIL_TRANSPORT=console: los códigos se muestran en el log y no se envían por correo.',
            'AuthModule',
          );
        }

        const looksLikePlaceholder =
          transportMode !== 'console' &&
          (!user ||
            !pass ||
            user === 'tu_correo@gmail.com' ||
            rawPass === 'tu_app_password');

        if (looksLikePlaceholder) {
          Logger.warn(
            'GMAIL_USER / GMAIL_PASS no tienen credenciales reales: el envío de códigos de recuperación fallará. Usa una contraseña de aplicación de Google o define MAIL_TRANSPORT=console para desarrollo.',
            'AuthModule',
          );
        }

        return {
          transport: {
            host,
            port,
            secure,
            auth: {
              user,
              pass,
            },
          },
          defaults: {
            from: `"Sistema SIRD" <${fromAddress}>`,
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: { strict: true },
          },
        };
      },
    }),

  ],
  controllers: [
    AuthController,
    RolesController,
    UsersController,
    AsignarRolesController,
  ],
  providers: [
    AuthService,
    UserService,
    JwtStrategy,
    RolesService,
    AsignarRolesService,
  ],
  exports: [AuthModule, TypeOrmModule, JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule { }
