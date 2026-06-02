import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Cortes } from './corte.entity';
import { PeriodoLectivo } from './periodoLectivo.entity';

@Entity({ schema: 'catalogos', name: 'periodo_lectivo_corte' })
export class PeriodoLectivoCorte {
  @PrimaryColumn({ name: 'periodo_lectivo_id', type: 'int4' })
  periodoLectivoId: number;

  @PrimaryColumn({ name: 'corte_id', type: 'int4' })
  corteId: number;

  @Column({ name: 'orden', type: 'int2', nullable: true })
  orden?: number;

  @ManyToOne(() => PeriodoLectivo, (periodoLectivo) => periodoLectivo.cortesPeriodo, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'periodo_lectivo_id' })
  periodoLectivo: PeriodoLectivo;

  @ManyToOne(() => Cortes, (corte) => corte.periodoLectivoCortes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'corte_id' })
  corte: Cortes;
}
