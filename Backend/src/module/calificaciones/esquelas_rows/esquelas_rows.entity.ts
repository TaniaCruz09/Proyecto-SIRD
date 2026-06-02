import { Asignatura } from 'src/module/catalogos/entities/asignatura.entity';
import { Cortes } from 'src/module/catalogos/entities/corte.entity';
import { StudentEntity } from 'src/module/createEstudents/students.entity';
import {
    Column,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { EsquelaHeadEntity } from '../esquela_head/entities/squela_head.entity';
@Entity({ schema: 'calificaciones', name: 'esquela_row' })
export class EsquelaRow {
    @PrimaryGeneratedColumn('increment', {
        name: 'id',
        type: 'int4',
    })
    id?: number;

    @ManyToOne(() => StudentEntity, (estudiante) => estudiante.id)
    @JoinColumn({ name: 'estudiante_id' })
    estudiante: StudentEntity;

    @ManyToOne(() => Asignatura, (asignatura) => asignatura.calificacion)
    @JoinColumn({ name: 'asignatura_id' })
    asignatura: Asignatura;

    @Column({
        name: 'nota_cualitativa',
        type: 'varchar',
    })
    notaCualitativa: string;

    @Column({
        name: 'nota_cuantitativa',
        type: 'int4',
    })
    notaCuantitativa?: number;

    @ManyToOne(() => Cortes, (corte) => corte.calificacion, { cascade: true })
    @JoinColumn({ name: 'corte_id' })
    corte: Cortes;

    @ManyToOne(() => EsquelaHeadEntity, (esquelaHead) => esquelaHead.esquelaRow)
    @JoinColumn({ name: 'esquelaHead_id' })
    esquelaHead: EsquelaHeadEntity;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
    deleted_at: Date;
}
