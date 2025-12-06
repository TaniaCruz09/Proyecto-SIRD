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
import { GradesEntity, Modalidad, Seccion, Turno } from '../../catalogos';
import { User } from '../../auth/entities';
import * as moment from 'moment-timezone';
import { Docentes } from 'src/module/docentes/docentes.entity';
import { OrganizacionEscolar } from './organizacionEscolar.entity';
import { GrupoAsignaturaDocente } from './GrupoAsignaturaDocente.entity';
import { EsquelaHeadEntity } from 'src/module/calificaciones/esquela_head/entities/squela_head.entity';

@Entity({ name: 'grupos', schema: 'organizacion_escolar' })
export class Grupos {
    @PrimaryGeneratedColumn({
        name: 'id',
        type: 'int2',
    })
    id: number;

    @ManyToOne(() => GradesEntity, (grado) => grado.grupos, { onDelete: 'CASCADE' })
    grado: GradesEntity;

    @ManyToOne(() => Seccion, (seccion) => seccion.grupos, { onDelete: 'CASCADE' })
    seccion: Seccion;

    @ManyToOne(() => Turno, (turno) => turno.grupos, { onDelete: 'CASCADE' })
    turno: Turno;

    @ManyToOne(() => OrganizacionEscolar, (organizacionEscolar) => organizacionEscolar.grupos, { eager: true })
    organizacionEscolar: OrganizacionEscolar;

    @ManyToOne(() => Docentes, (docente) => docente.grupos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'docente_guia_id' })
    docenteGuia: Docentes;

    @OneToMany(() => GrupoAsignaturaDocente, gad => gad.grupo)
    grupoAsignaturaDocente: GrupoAsignaturaDocente[];

    @OneToOne(() => EsquelaHeadEntity, (esquelaHead) => esquelaHead.grupo_asignatura)
    esquelaHead = EsquelaHeadEntity;

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
