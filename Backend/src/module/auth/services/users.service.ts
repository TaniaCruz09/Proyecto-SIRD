import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities";
import { Repository } from "typeorm";
import { UserPartialTypeDto, UsersDto } from "../dtos/users-dto";
import { SetupEnum } from "../enums";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { Utilities } from "src/common/helpers/utilities";

@Injectable()
export class UserService {
    users: any[] = [];

    //Inyectamos el servicion de users
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,  // <-- INYECTAR JwtService
     ) {}

     countItems(){
        return this.users.length;
     }

     async findByEmail(email:string) {
        const user = await this.userRepository.findOne({
            where: {email},
            relations: ['roles'],
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
          let { password, email, name } = payload;
  
          // Hashear la contraseña antes de guardar
          password = await bcrypt.hash(password, SetupEnum.SALTORROUND);
  
          // Crear usuario
          const newUser = this.userRepository.create({ name, email, password });
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
  
          return { user: savedUser, token };
      } catch (error) {
          throw new InternalServerErrorException(error);
      }
  }
    
      async getUsers() {
        const users = await this.userRepository.find({relations: ['roles']});
        return users;
      }
    
      async getUserById(id: number): Promise<User> {
        try{
          const user = await this.userRepository.findOne({ where: { id }, relations: ['roles'] });
          return user;
        } catch (error){
          Utilities.catchError(error);
        }
      }
    
      async updated(id: number, payload: UserPartialTypeDto) {
        const oldUser = await this.userRepository.findOne({ where: { id: id }, relations: ['roles'] });
        if (!oldUser) {
          throw new NotFoundException('No se encontro el usuario');
        }

        // Convertir los roles de number[] a objetos con id si existen en el payload
      const roles = (payload as any).rol?.map((roleId: number) => ({ id: roleId }));
    
        const merged = this.userRepository.merge(oldUser, {
    ...payload,
    ...(roles && { roles: roles }), // solo si viene el campo roles
  });

  return await this.userRepository.save(merged);
      }

      // deleted(id: number) {
      //   const index = this.users.findIndex((user) => user.id === id);
      //   this.users.splice(index, 1);
      //   return 'Usuario eliminado con éxito';
      // }
    
      async deleted(id: number): Promise<User> {
        const index = await this.userRepository.findOne({ where: { id } });
        return await this.userRepository.remove(index)
      }
}