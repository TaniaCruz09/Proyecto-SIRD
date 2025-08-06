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
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Grupos } from './grupos.entity';
import { User } from '../../auth/entities';
import * as moment from 'moment-timezone';
import { AnioLectivo } from 'src/module/catalogos/entities/anioLectivo.entity';
import { Docentes } from '../../docentes/docentes.entity';
import { Asignatura } from '../../catalogos';
import { Cortes } from '../../catalogos/entities/corte.entity';
import { OrganizacionConEstudiantes } from './organizacionConEstudiante';

@Entity({ name: 'organizacionEscolar', schema: 'organizacion_escolar' })
export class OrganizacionEscolar {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int2' })
  id: number;

  @ManyToOne(() => AnioLectivo)
  @JoinColumn({ name: 'anioLectivo_id' })
  anio_lectivo: AnioLectivo;

  @ManyToOne(() => Grupos)
  @JoinColumn({ name: 'grupo_id' })
  grupo: Grupos;

  @ManyToOne(() => Docentes)
  @JoinColumn({ name: 'docente_guia_id' })
  docenteGuia: Docentes;

  @ManyToMany(() => Docentes, (docente) => docente.organizacionesEscolares)
  @JoinTable({
    name: 'organizacion_escolar_docentes',
    joinColumn: { name: 'organizacion_escolar_id' },
    inverseJoinColumn: { name: 'docente_id' },
  })
  docentes: Docentes[];

  @ManyToMany(() => Asignatura, (asignatura) => asignatura.organizacionesEscolares)
  @JoinTable({
    name: 'organizacion_escolar_asignaturas',
    joinColumn: { name: 'organizacion_escolar_id' },
    inverseJoinColumn: { name: 'asignatura_id' },
  })
  asignaturas: Asignatura[];

  @ManyToMany(() => Cortes, (corte) => corte.organizacionesEscolares)
  @JoinTable({ name: 'organizacionEscolar_tiene_cortes' })
  cortes: Cortes[];

  @OneToMany(() => OrganizacionConEstudiantes, (oe) => oe.organizacionEscolar)
  estudiantes?: OrganizacionConEstudiantes[];


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
