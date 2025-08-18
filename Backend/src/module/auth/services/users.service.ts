import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
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

@Injectable()
export class UserService {
  users: any[] = [];

  //Inyectamos el servicion de users
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,  // <-- INYECTAR JwtService
  ) { }

  countItems() {
    return this.users.length;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['roles', 'docente'],
      // select: {
      //     id: true,
      //     email: true,
      //     name: true,
      //     password: true
      // },
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
      const newUser = this.userRepository.create({ name, email, password, docente: docente ? { id: docente.id } as any : null,roles: roles?.map((roleId) => ({ id: roleId })), });
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
      const user = await this.userRepository.findOne({ where: { id }, relations: ['roles', 'docente'] });
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