// import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
// import { Docentes } from "../docentes/docentes.entity";
// import { Asignatura } from "../catalogos/entities/asignatura.entity";
// import { User } from "../auth/entities";
// import * as moment from 'moment-timezone';
// import { OrganizacionLaboralAsignaturaGrupo } from "../OrganizacionLaboralAsignaturaGrupo/AsignaturaGrupo.entity";
// import { OrganizacionEscolar } from "../organizacionEscolar/entities/organizacionEscolar.entity";

// @Entity({ name: 'organizacionLaboral', schema: 'organizacionlaboral' })
// export class OrganizacionLaboral {
//   @PrimaryGeneratedColumn({
//     name: 'id',
//     type: 'int2',
//   })
//   id: number;

//   @ManyToOne(() => Docentes, (docente) => docente.organizacionLaboral)
//   @JoinColumn({ name: 'docente_id' })
//   docente: Docentes;

//   @Column({ name: 'docente_id', type: 'int4', nullable: true })
//   docente_id: number;

//   @ManyToOne(() => OrganizacionEscolar, (añoLectivo) => añoLectivo.organizacionLaboral)
//   @JoinColumn({ name: 'anio_lectivo_id' })
//   añolectivo: OrganizacionEscolar;

//   @Column({ name: 'anio_lectivo_id', type: 'int2', nullable: true })
//   anio_lectivo_id: number;

//   @ManyToOne(() => Asignatura, (asignatura) => asignatura.organizacionLaboral)
//   @JoinColumn({ name: 'asignatura_id' })
//   asignatura: Asignatura;

//       // @Column({ name: 'asignatura_id', type: 'int4', nullable: true })
//       // asignatura_id: number;

//       // // Relación a grupo académico
//       // @ManyToMany(() => Grupos, (grupos) => grupos.organizacionLaboralAsociada)
//       // @JoinTable({ name: 'organizacionLaboral_tienen_varios_grupos' })
//       // grupos: Grupos[];

//   @Column({ name: 'grupo_id', type: 'int4', nullable: true })
//   grupo_id: number;

//   // Relación a grupo guía
//   // @ManyToOne(() => Grupos, (grupos) => grupos.organizacionLaboralComoGuia)
//   // @JoinColumn({ name: 'grupo_guia_id' })
//   // grupoGuia: Grupos;

//   @Column({ name: 'grupo_guia_id', type: 'int4', nullable: true })
//   grupo_guia_id: number;


//   @ManyToOne(() => User, (user) => user.id)
//   @JoinColumn({ name: 'user_create_id' }) // Se enlaza con el usuario que creó el registro
//   user_create: User;

//   @ManyToOne(() => User, (user) => user.id)
//   @JoinColumn({ name: 'user_update_id' }) // Se enlaza a la columna 'user_update_id'
//   user_update: User;

//   @ManyToOne(() => User, (user) => user.id)
//   @JoinColumn({ name: 'deleted_at_id' }) // Se enlaza con el usuario que eliminó el registro
//   user_delete: User;

//   @OneToMany(() => OrganizacionLaboralAsignaturaGrupo, asignaturaGrupo => asignaturaGrupo.organizacionLaboral)
//   organizacionLaboral: OrganizacionLaboralAsignaturaGrupo[];


//   @Column({ name: 'user_create_id', type: 'int4', nullable: true }) // Nuevo campo
//   user_create_id: number;

//   // Fecha y hora en que se creó el registro
//   @CreateDateColumn({
//     name: 'created_at',
//     type: 'timestamp',
//     default: () => 'CURRENT_TIMESTAMP', // Guarda la fecha en UTC por defecto
//     transformer: {
//       to: (value: Date) => value, // Guarda la fecha tal como es
//       from: (value: Date) =>
//         moment(value).tz('America/Managua').format('YYYY-MM-DD hh:mm A'), // Formatea a hora de Nicaragua
//     },
//   })
//   created_at: Date;

//   // Fecha y hora de la última actualización del registro
//   @UpdateDateColumn({
//     name: 'update_at',
//     type: 'timestamp',
//     onUpdate: 'CURRENT_TIMESTAMP',
//     transformer: {
//       to: (value: Date) => value,
//       from: (value: Date) =>
//         moment(value).tz('America/Managua').format('YYYY-MM-DD hh:mm A'),
//     },
//   })
//   update_at: Date;

//   // ID del usuario que realizó la última actualización del registro
//   @Column({ name: 'user_update_id', type: 'int4', nullable: true })
//   user_update_id: number;

//   // Fecha y hora en que el registro fue eliminado
//   @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
//   deleted_at: Date;

//   // ID del usuario que elimino el registro
//   @Column({ name: 'deleted_at_id', type: 'int4', nullable: true })
//   deleted_at_id: number;
// }
