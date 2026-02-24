import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { AnioLectivo } from './anioLectivo.entity';
import { Cortes } from './corte.entity';

@Entity({ schema: 'catalogos', name: 'anio_lectivo_corte' })
export class AnioLectivoCorte {
  @PrimaryColumn({ name: 'anio_lectivo_id', type: 'int2' })
  anioLectivoId: number;

  @PrimaryColumn({ name: 'corte_id', type: 'int4' })
  corteId: number;

  @ManyToOne(() => AnioLectivo, (anioLectivo) => anioLectivo.cortesAnioLectivo, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'anio_lectivo_id' })
  anioLectivo: AnioLectivo;

  @ManyToOne(() => Cortes, (corte) => corte.anioLectivoCortes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'corte_id' })
  corte: Cortes;
}
