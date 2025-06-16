import { Column, DeleteDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({schema: 'auth', name: 'roles'})
export class Role {
    @PrimaryGeneratedColumn({name: 'id', type: 'int4'})
    id?: number;

    @Column({name: 'rol', type: 'varchar', length: 50, nullable: true, unique: true})
    rol: string;

    @ManyToMany(()=> User, (user)=> user.roles)
    users: User[];

    @Column({
        name: 'is_active',
        type: 'boolean',
        nullable: false,
        default: true,
      })
      isActive: boolean;
    
      @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
      deleteAt: Date;
}