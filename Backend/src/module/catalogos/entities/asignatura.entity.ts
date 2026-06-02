import * as moment from 'moment';
import { User } from '../../auth/entities/user.entity';
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
import { GrupoAsignaturaDocente } from '../../organizacionEscolar/entities/GrupoAsignaturaDocente.entity';
import { EsquelaRow } from '../../calificaciones/esquelas_rows/esquelas_rows.entity';
@Entity({ schema: 'catalogos', name: 'asignatura' })
export class Asignatura {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    name: 'asignatura',
    nullable: false,
  })
  asignatura: string;

  @OneToMany(() => GrupoAsignaturaDocente, gad => gad.asignatura)
  grupoAsignaturaDocente: GrupoAsignaturaDocente[];

  @OneToMany(() => EsquelaRow, (calificaciones) => calificaciones.asignatura)
  @JoinColumn({ name: 'esquela_row_id' })
  calificacion: EsquelaRow;

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
  created_at: Date;

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
  user_update_id: number;

  //Fecha y Hora en el que el registro fue eliminado
  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deleted_at: Date;

  //ID del Usuario que elimino el registro
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
