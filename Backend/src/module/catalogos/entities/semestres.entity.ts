import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as moment from 'moment-timezone';
import { User } from 'src/module/auth/entities';
import { Cortes } from './corte.entity';

@Entity({ schema: 'catalogos', name: 'semestre' })
export class SemestreEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'int4',
  })
  id?: number;

  @Column({
    name: 'abreviatura',
    type: 'varchar',
    nullable: false,
    length: 30,
  })
  abreviatura: string;

  @Column({
    name: 'semestre',
    type: 'varchar',
    nullable: false,
    length: 30,
  })
  semestre: string;

  @OneToMany(() => Cortes, (cortes) => cortes.semestre)
  corte?: Cortes[];

  @Column({ name: 'user_create_id', type: 'int4', nullable: true }) // Nuevo campo
  user_create_id: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP', // Guarda la fecha en UTC por defecto
    transformer: {
      to: (value: Date) => value, // Guarda la fecha tal como es
      from: (value: Date) =>
        moment(value).tz('America/Managua').format('YYYY-MM-DD hh:mm A'), // Formatea a hora de Nicaragua
    },
  })
  created_at: Date;

  @UpdateDateColumn({
    name: 'update_at',
    type: 'timestamp',
    onUpdate: 'CURRENT_TIMESTAMP',
    transformer: {
      to: (value: Date) => value,
      from: (value: Date) =>
        moment(value).tz('America/Managua').format('YYYY-MM-DD hh:mm A'),
    },
  })
  update_at: Date;

  @Column({ name: 'user_update_id', type: 'int4', nullable: true })
  user_update_id: number;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deleted_at: Date;

  @Column({ name: 'deleted_at_id', type: 'int4', nullable: true })
  deleted_at_id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_create_id' }) // Se enlaza con el usuario que creó el registro
  user_create: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_update_id' }) // Se enlaza a la columna 'user_update_id'
  user_update: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'deleted_at_id' }) // Se enlaza con el usuario que eliminó el registro
  user_delete: User;
}
