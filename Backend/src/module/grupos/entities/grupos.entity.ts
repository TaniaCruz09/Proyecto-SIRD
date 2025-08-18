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
import { GradesEntity, Modalidad, Seccion, Turno } from '../../catalogos';
import { Docentes } from '../../docentes/docentes.entity';
import { GruposConEstudiantes } from './gruposConEstudiantes.entity';
import { User } from '../../auth/entities';
import * as moment from 'moment-timezone';
import { OrganizacionEscolar } from './organizacionEscolar.entity';
import { OrganizacionLaboral } from 'src/module/organizacionLaboral/organizacionLaboral.entity';
import { OrganizacionLaboralAsignaturaGrupo } from 'src/module/OrganizacionLaboralAsignaturaGrupo/AsignaturaGrupo.entity';

@Entity({ name: 'grupos', schema: 'grupos' })
export class Grupos {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'int2',
  })
  id: number;

  @ManyToOne(() => GradesEntity, (grado) => grado.grupos)
  grado: GradesEntity;

  @ManyToOne(() => Seccion, (seccion) => seccion.grupos)
  seccion: Seccion;

  @ManyToOne(() => Modalidad, (modalidad) => modalidad.grupos)
  modalidad: Modalidad;

  @ManyToOne(() => Turno, (turno) => turno.grupos)
  turno: Turno;

  @ManyToOne(() => Docentes, (docente) => docente.grupos)
  docente: Docentes;

  // ...existing code...
  @ManyToMany(
    () => GruposConEstudiantes,
    (grupoConEstudiantes) => grupoConEstudiantes.grupo,
  )
  @JoinTable({ name: 'grupos_tienen_gruposConEstudiantes' }) // Si necesitas tabla intermedia
  grupoConEstudiantes: GruposConEstudiantes;
  // ...existing code...
  @ManyToOne(
    () => OrganizacionEscolar,
    (organizacionEscolar) => organizacionEscolar.grupo,
  )
  organizacionEscolar: OrganizacionEscolar;

  @OneToMany(() => OrganizacionLaboralAsignaturaGrupo, (org) => org.grupo)
  grupo: OrganizacionLaboralAsignaturaGrupo[];

  @OneToMany(() => OrganizacionLaboral, (org) => org.grupoGuia)
  organizacionLaboralComoGuia: OrganizacionLaboral[];


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
