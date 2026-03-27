import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AnioLectivo } from './anioLectivo.entity';
import { PeriodoLectivoCorte } from './periodoLectivoCorte.entity';

@Entity({ schema: 'catalogos', name: 'periodo_lectivo' })
@Index('ux_periodo_lectivo_anio_orden', ['anioLectivoId', 'orden'], { unique: true })
export class PeriodoLectivo {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int4' })
  id: number;

  @Column({ name: 'anio_lectivo_id', type: 'int2' })
  anioLectivoId: number;

  @Column({ name: 'nombre', type: 'varchar', length: 60 })
  nombre: string;

  @Column({ name: 'abreviatura', type: 'varchar', length: 20, nullable: true })
  abreviatura?: string;

  @Column({ name: 'tipo', type: 'varchar', length: 30, default: () => "'PERSONALIZADO'" })
  tipo: string;

  @Column({ name: 'orden', type: 'int2' })
  orden: number;

  @ManyToOne(() => AnioLectivo, (anioLectivo) => anioLectivo.periodosLectivos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'anio_lectivo_id' })
  anioLectivo: AnioLectivo;

  @OneToMany(() => PeriodoLectivoCorte, (periodoLectivoCorte) => periodoLectivoCorte.periodoLectivo)
  cortesPeriodo?: PeriodoLectivoCorte[];
}
