// import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
// import { Grupos } from "./grupos.entity";
// import { Asignatura } from "src/module/catalogos";
// import { User } from "src/module/auth/entities";
// import * as moment from 'moment-timezone';
// import { Docentes } from "src/module/docentes/docentes.entity";




// @Entity({ name: 'organizacion_escolar_asignaturas', schema: 'organizacion_escolar' })
// export class OrganizacionEscolarConAsignaturas {

//     @PrimaryGeneratedColumn({
//         name: 'id',
//         type: 'int2',
//     })
//     id: number;

//     @ManyToOne(() => Grupos, (grupo) => grupo.id)
//     @JoinColumn({ name: 'grupo_id' })
//     grupo: Grupos;

//     @ManyToOne(() => Docentes, (docente) => docente.id)
//     @JoinColumn({ name: 'docente_id' })
//     docente: Docentes;

//     @ManyToMany(() => Asignatura, (asignatura) => asignatura.id)
//     @JoinTable({
//         name: 'organizacion_escolar_asignaturas_asignatura', // tabla pivote
//         joinColumn: { name: 'organizacion_escolar_asignatura_id', referencedColumnName: 'id' },
//         inverseJoinColumn: { name: 'asignatura_id', referencedColumnName: 'id' },
//     })
//     asignaturas: Asignatura[];


//     @Column({ name: 'user_create_id', type: 'int4', nullable: true })
//     user_create_id: number;

//     @CreateDateColumn({
//         name: 'created_at',
//         type: 'timestamp',
//         default: () => 'CURRENT_TIMESTAMP',
//         transformer: {
//             to: (value: Date) => value,
//             from: (value: Date) =>
//                 moment(value).tz('America/Managua').format('YYYY-MM-DD hh:mm A'),
//         },
//     })
//     created_at: Date;

//     @UpdateDateColumn({
//         name: 'update_at',
//         type: 'timestamp',
//         onUpdate: 'CURRENT_TIMESTAMP',
//         transformer: {
//             to: (value: Date) => value,
//             from: (value: Date) =>
//                 moment(value).tz('America/Managua').format('YYYY-MM-DD hh:mm A'),
//         },
//     })
//     update_at: Date;

//     @Column({ name: 'user_update_id', type: 'int4', nullable: true })
//     user_update_id: number;

//     @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
//     deleted_at: Date;

//     @Column({ name: 'deleted_at_id', type: 'int4', nullable: true })
//     deleted_at_id: number;

//     @ManyToOne(() => User, (user) => user.id)
//     @JoinColumn({ name: 'user_create_id' }) // Se enlaza con el usuario que creó el registro
//     user_create: User;

//     @ManyToOne(() => User, (user) => user.id)
//     @JoinColumn({ name: 'user_update_id' }) // Se enlaza a la columna 'user_update_id'
//     user_update: User;

//     @ManyToOne(() => User, (user) => user.id)
//     @JoinColumn({ name: 'deleted_at_id' }) // Se enlaza con el usuario que eliminó el registro
//     user_delete: User;
//     // Define the properties and relationships for the OrganizacionEscolarAsignaturas entity
// }