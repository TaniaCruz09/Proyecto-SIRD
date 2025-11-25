import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities";
import { Repository } from "typeorm";
import { UserPartialTypeDto, UsersDto } from "../dtos/users-dto";
import { SetupEnum } from "../enums";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { Utilities } from "src/common/helpers/utilities";
import { Docentes } from "src/module/docentes/docentes.entity";
import { Role } from "../entities/roles.entity";
import { MailerService } from "@nestjs-modules/mailer";
import { randomInt } from "crypto";

@Injectable()
export class UserService {
  users: any[] = [];

  //Inyectamos el servicion de users
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,  // <-- INYECTAR JwtService
    private readonly mailerService: MailerService, // <-- INYECTAR MailerService
  ) { }

  countItems() {
    return this.users.length;
  }

  //----------------- MÉTODOS PARA RECUPERAR CONTRASEÑA -----------------
// Generar y enviar código de recuperación
   async generateResetCode(email: string) {
    const user = await this.findByEmail(email);

    const code = String(randomInt(100000, 999999)); // 6 dígitos
    const expire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

    user.resetCode = code;
    user.resetCodeExpire = expire;
    await this.userRepository.save(user);

    // Enviar correo
    await this.mailerService.sendMail({
  to: user.email,
  subject: '🔒 Código de verificación - Recuperación de contraseña',
  html: `
    <div style="font-family: Arial, sans-serif; background-color: #f6f6f6; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
        <h2 style="color: #333;">Hola ${user.name || 'Usuario'} 👋</h2>
        <p>Has solicitado restablecer tu contraseña. Usa el código de verificación a continuación:</p>
        <p style="font-size: 24px; font-weight: bold; color: #007bff; text-align: center; margin: 20px 0;">
          ${code}
        </p>
        <p>Este código es válido por 10 minutos.</p>
        <p>Si no solicitaste este cambio, ignora este correo.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888;">Este correo fue enviado automáticamente por Mi App.</p>
      </div>
    </div>
  `,
});
  }
  // Verificar código y generar token temporal
  async verifyResetCode(email: string, code: string) {
  const user = await this.findByEmail(email);

  if (user.resetCode !== code) throw new BadRequestException('Código incorrecto');
  if (user.resetCodeExpire < new Date()) throw new BadRequestException('Código expirado');

  // Generar token temporal para cambiar contraseña
  const tempToken = this.jwtService.sign(
    { sub: user.id, action: 'reset' },
    { expiresIn: '15m' },
  );

  return { token: tempToken };
}
//cambiar contraseña usando token temporal
async resetPassword(tempToken: string, newPassword: string) {
  try {
    const payload = this.jwtService.verify(tempToken);
    if (payload.action !== 'reset') throw new BadRequestException('Token inválido');

    const user = await this.getUserById(payload.sub);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    user.password = await bcrypt.hash(newPassword, SetupEnum.SALTORROUND);
    user.resetCode = null;
    user.resetCodeExpire = null;

    await this.userRepository.save(user);
    return { message: 'Contraseña actualizada correctamente' };
  } catch (err) {
    throw new BadRequestException('Token inválido o expirado');
  }
}
//--------------------------------------------------------------



  async findByEmail(email: string) {
    
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['roles', 'docente', 'docente.profession'],
    });

    if (!user) {
      throw new NotFoundException('No se encotro el usuario');
    }
    return user;
  }

  async created(payload: UsersDto) {
    try {
      let { password, email, name, docente, roles } = payload;

      // Hashear la contraseña antes de guardar
      password = await bcrypt.hash(password, SetupEnum.SALTORROUND);

      // Si es docente y no viene name, tomarlo del docente
      if (docente && !name) {
        const docenteEntity = await this.userRepository.manager.findOne(Docentes, {
          where: { id: docente.id },
        });
        if (!docenteEntity) {
          throw new NotFoundException('Docente no encontrado');
        }
        name = docenteEntity.nombres; // o el campo que tenga el nombre
      }
      // Crear usuario
      const newUser = this.userRepository.create({ name, email, password, docente: docente ? { id: docente.id } as any : null, roles: roles?.map((roleId) => ({ id: roleId })), });
      const savedUser = await this.userRepository.save(newUser);

      // Generar el token
      const token = await this.jwtService.signAsync({
        sub: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
      });

      // Guardar el token en la BD
      savedUser.token = token;
      await this.userRepository.save(savedUser);

      // Retornar con relaciones
      return await this.userRepository.findOne({
        where: { id: savedUser.id },
        relations: ['roles', 'docente'],
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getUsers() {
    const users = await this.userRepository.find({ relations: ['roles', 'docente'] });
    return users;
  }

  async getUserById(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id }, relations: ['roles', 'docente', 'docente.profession'] });
      return user;
    } catch (error) {
      Utilities.catchError(error);
    }
  }

  async updated(id: number, payload: UserPartialTypeDto) {
    const oldUser = await this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'docente'],
    });

    if (!oldUser) throw new NotFoundException('No se encontró el usuario');

    // Actualizar campos básicos
    oldUser.name = payload.name ?? oldUser.name;
    oldUser.email = payload.email ?? oldUser.email;
    if (payload.password) {
      oldUser.password = await bcrypt.hash(payload.password, SetupEnum.SALTORROUND);
    }

    // Actualizar docente
    if (payload.docente) {
      const docenteEntity = await this.userRepository.manager.findOne(Docentes, { where: { id: payload.docente.id } });
      if (!docenteEntity) throw new NotFoundException('Docente no encontrado');
      oldUser.docente = docenteEntity;
      if (!payload.name) oldUser.name = docenteEntity.nombres;
    }

    // Actualizar roles correctamente
    if (payload.roles) {
      oldUser.roles = payload.roles.map((roleId) =>
        this.userRepository.manager.create(Role, { id: roleId })
      );
    }

    return await this.userRepository.save(oldUser);
  }



  // deleted(id: number) {
  //   const index = this.users.findIndex((user) => user.id === id);
  //   this.users.splice(index, 1);
  //   return 'Usuario eliminado con éxito';
  // }

  async deleted(id: number): Promise<User> {
    const index = await this.userRepository.findOne({ where: { id }, relations: ['roles', 'docente'] });
    return await this.userRepository.remove(index)
  }
}