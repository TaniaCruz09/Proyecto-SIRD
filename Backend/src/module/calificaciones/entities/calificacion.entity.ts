import { Asignatura, Cortes } from 'src/module/catalogos';
import { StudentEntity } from 'src/module/createEstudents';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity({ schema: 'calificaciones', name: 'calificaciones' })
export class Calificaciones {
  @PrimaryGeneratedColumn('increment', {
    name: 'id',
    type: 'int4',
  })
  id?: number;

  @ManyToOne(() => StudentEntity, (estudiante) => estudiante.id)
  @JoinColumn({ name: 'estudiante_id' })
  estudiante: StudentEntity;

  @ManyToOne(() => Asignatura, (asignatura) => asignatura.id)
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
}
