
import { User } from '../../auth/entities';
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
import { Grupos } from 'src/module/organizacionEscolar/entities/grupos.entity';
import { Modalidad } from './modalidad.entity';
import { OrganizacionEscolar } from 'src/module/organizacionEscolar/entities/organizacionEscolar.entity.';

@Entity({ schema: 'catalogos', name: 'turno' })
export class Turno {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'int4',
  })
  id: number;


  @Column({
    name: 'turno',
    type: 'varchar',
    nullable: true,
    //length: 50,
  })
  turno: string;

  //ID del usuario que creó el registro
  @Column({ name: 'user_create_id', type: 'int4', nullable: true }) // Nuevo campo
  user_create_id: number;

  // Fecha y hora en que se creó el registro
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

  // Fecha y hora de la última actualización del registro
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

  // ID del usuario que realizó la última actualización del registro
  @Column({ name: 'user_update_id', type: 'int4', nullable: true })
  user_update_id: number;

  // Fecha y hora en que el registro fue eliminado
  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deleted_at: Date;

  // ID del usuario que elimino el registro
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

  @OneToMany(() => Grupos, (grupos) => grupos.turno)
  grupos?: Grupos[];

  @ManyToOne(() => Modalidad, (modalidad) => modalidad.turnos)
  modalidad: Modalidad

  @OneToMany(() => OrganizacionEscolar, (organizacionEscolar) => organizacionEscolar.turno)
  organizacionEscolar?: OrganizacionEscolar[];
}
