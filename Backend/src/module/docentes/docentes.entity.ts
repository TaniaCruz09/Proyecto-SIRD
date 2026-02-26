import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  AcademicLevelEntity,
  Departamento,
  GenderEntity,
  Municipio,
  Pais,
  ProfessionsEntity,
} from '../catalogos';
import { User } from '../auth/entities';
import * as moment from 'moment-timezone';
import { Grupos } from '../organizacionEscolar/entities/grupos.entity';
import { GrupoAsignaturaDocente } from '../organizacionEscolar/entities/GrupoAsignaturaDocente.entity';
import e from 'express';

@Entity({ name: 'docentes', schema: 'docentes' })
export class Docentes {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'int2',
  })
  id: number;

  @OneToMany(() => User, (user) => user.docente)
  User?: User;

  @Column({
    name: 'nombres',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  nombres: string;

  @Column({
    name: 'apellido_paterno',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  apellido_paterno: string;

  @Column({
    name: 'apellido_materno',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  apellido_materno: string;

  @Column({
    name: 'cedula_identidad',
    type: 'varchar',
    nullable: true,
  })
  cedula_identidad: string;

  @Column({
    name: 'telefono',
    type: 'varchar',
    nullable: true,
  })
  telefono: string;

  @Column({
    name: 'foto',
    type: 'varchar',
    nullable: true,
  })
  foto_docente?: string;  // foto del docente


  @Column({
    name: 'fecha_nacimiento',
    type: 'date',
    nullable: true,
  })
  fecha_nacimiento: Date;

  @Column({
    name: 'direccion_domiciliar',
    type: 'varchar',
    nullable: true,
  })
  direccion_domiciliar: string;

  @Column({
    name: 'fechaContratado',
    type: 'date',
    nullable: true,
  })
  fechaContratado: Date;

  @Column({
    name: 'nombre_contacto_emergencia',
    type: 'varchar',
    nullable: true,
  })
  nombre_contacto_emergencia: string;

  @Column({
    name: 'telefono_contacto_emergencia',
    type: 'varchar',
    nullable: true,
  })
  telefono_contacto_emergencia: string;

  @Column({
    name: 'correo',
    type: 'varchar',
    nullable: true,
  })
  correo?: string;

  @ManyToOne(() => GenderEntity)
  @JoinColumn({ name: 'sexo' })
  sexo: GenderEntity;

  @ManyToMany(() => AcademicLevelEntity, (academiclevel) => academiclevel.docente,
  )
  @JoinTable({ name: 'docentes_tienen_nivel_academico' })
  nivel_academico: AcademicLevelEntity[];

  @ManyToMany(() => ProfessionsEntity, (profesion) => profesion.docente)
  @JoinTable({ name: 'docentes_tienen_profesiones' })
  profession: ProfessionsEntity[];

  @ManyToOne(() => Pais)
  @JoinColumn({ name: 'pais_id' })
  pais: Pais;

  @ManyToOne(() => Municipio)
  @JoinColumn({ name: 'municipio_id' })
  municipio: Municipio;

  @OneToMany(() => Grupos, (grupo) => grupo.docenteGuia, { eager: true })
  grupos?: Grupos[];

  @OneToMany(() => GrupoAsignaturaDocente, gad => gad.docente)
  grupoAsignaturaDocente: GrupoAsignaturaDocente[];

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
}
