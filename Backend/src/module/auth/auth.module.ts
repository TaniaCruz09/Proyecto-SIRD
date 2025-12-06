import { Module } from '@nestjs/common';
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
import { User, Role } from './entities';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
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

        return {
          transport: {
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
              user: config.get<string>('GMAIL_USER'),
              pass: config.get<string>('GMAIL_PASS'),
            },
          },
          defaults: {
            from: `"Sistema SIRD" <${config.get<string>('GMAIL_USER')}>`,
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
