import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Departamento, GenderEntity, Municipio, Pais } from '../catalogos';

import * as moment from 'moment-timezone';
import { User } from '../auth/entities';
import { OrganizacionConEstudiantes } from '../organizacionEscolar/entities/organizacionConEstudiante';

@Entity({ name: 'student' })
export class StudentEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'int4',
  })
  id?: number;

  @Column({
    name: 'nombres',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  name: string;

  @Column({
    name: 'apellidos',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  lastName: string;

  @Column({
    name: 'codigo_estudiante',
    type: 'varchar',
    nullable: true,
  })
  studentCode: string;

  @Column({
    name: 'cedula_identidad',
    type: 'varchar',
    length: 16,
    nullable: true,
  })
  identityCard: string;

  @Column({
    name: 'fecha_nacimiento',
    type: 'date',
    nullable: true,
  })
  dateBirt: Date;

  @Column({
    name: 'direccion_domiciliar',
    type: 'varchar',
    nullable: true,
  })
  address: string;

  @Column({
    name: 'Nombre_tutor',
    type: 'varchar',
    nullable: true,
  })
  tutorName: string;

  @Column({
    name: 'maestro_cedula_identidad',
    type: 'varchar',
    length: 16,
    nullable: true,
  })
  tutorIdentityCard: string;

  @Column({
    name: 'Numero',
    type: 'varchar',
    length: 8,
    nullable: true,
  })
  tutorPhoneNumber: string;

  @Column({
    name: 'observaciones',
    type: 'varchar',
    nullable: true,
  })
  observations: string;

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

  @ManyToOne(() => Pais, (pais) => pais.id)
  @JoinColumn({ name: 'pais_id' })
  pais: Pais;

  @ManyToOne(() => GenderEntity, (gender) => gender.id)
  @JoinColumn({ name: 'genero_id' })
  gender: GenderEntity;

  @ManyToOne(() => Departamento, (departmento) => departmento.id)
  @JoinColumn({ name: 'departamento_id' })
  departamento: Departamento;

  @ManyToOne(() => Municipio, (municipio) => municipio.id)
  @JoinColumn({ name: 'municipio_id' })
  municipio: Municipio;

  @OneToMany(() => OrganizacionConEstudiantes, (oe) => oe.estudiante)
  organizaciones?: OrganizacionConEstudiantes[];

}
