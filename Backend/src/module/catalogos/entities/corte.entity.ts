import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as moment from 'moment-timezone';
import { User } from '../../auth/entities';
import { SemestreEntity } from './semestres.entity';
import { OrganizacionEscolar } from 'src/module/organizacionEscolar/entities/organizacionEscolar.entity';

@Entity({ schema: 'catalogos', name: 'cortes' })
export class Cortes {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    type: 'varchar',
    length: 30,
    name: 'abreviatura',
  })
  abreviatura: string;

  @Column({
    type: 'varchar',
    length: 30,
    name: 'corte',
  })
  corte: string;

  @ManyToOne(() => SemestreEntity, (semestre) => semestre.corte)
  semestre: SemestreEntity;

  @OneToMany(() => OrganizacionEscolar, (organizacionEscolar) => organizacionEscolar.corte)
  organizacionEscolar?: OrganizacionEscolar[];

  // ID del Usuario que creo el registro
  @Column({ name: 'user_create_id', type: 'int4', nullable: true })
  user_create_id: number;

  // Fecha y Hora en el que se creo el registro
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
  create_at: Date;

  //Fecha y Hora de la ultima actualizacion del registro
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

  //ID del Usuario que realizo la ultima actualización
  @Column({ name: 'user_update_id', type: 'int4', nullable: true })
  user_updated_id: number;

  //Fecha y Hora en el que el registro fue eliminado
  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  delete_at: Date;

  //ID del Usuario que elimino el registro
  @Column({ name: 'deleted_at_id', type: 'int4', nullable: true })
  delete_at_id: number;

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
