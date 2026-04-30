import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as moment from 'moment-timezone';
import { User } from '../../auth/entities';
import { AnioLectivo } from './anioLectivo.entity';
import { Cortes } from './corte.entity';

@Entity({ schema: 'catalogos', name: 'anio_lectivo_calendarizacion' })
@Index('ux_anio_lectivo_calendarizacion_anio_corte', ['anioLectivoId', 'corteId'], { unique: true })
export class AnioLectivoCalendarizacion {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int4' })
  id: number;

  @Column({ name: 'anio_lectivo_id', type: 'int2' })
  anioLectivoId: number;

  @Column({ name: 'corte_id', type: 'int4' })
  corteId: number;

  @Column({ name: 'fecha_inicio', type: 'date', nullable: true })
  fecha_inicio?: string | null;

  @Column({ name: 'fecha_fin', type: 'date', nullable: true })
  fecha_fin?: string | null;

  @Column({ name: 'observacion', type: 'varchar', length: 255, nullable: true })
  observacion?: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'user_create_id', type: 'int4', nullable: true })
  user_create_id: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    transformer: {
      to: (value: Date) => value,
      from: (value: Date) =>
        moment(value).tz('America/Managua').format('YYYY-MM-DD hh:mm A'),
    },
  })
  created_at: Date;

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

  @Column({ name: 'user_update_id', type: 'int4', nullable: true })
  user_update_id: number;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  delete_at: Date;

  @Column({ name: 'deleted_at_id', type: 'int4', nullable: true })
  deleted_at_id: number;

  @ManyToOne(() => AnioLectivo, (anioLectivo) => anioLectivo.calendarizaciones, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'anio_lectivo_id' })
  anioLectivo: AnioLectivo;

  @ManyToOne(() => Cortes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'corte_id' })
  corte: Cortes;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_create_id' })
  user_create: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_update_id' })
  user_update: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'deleted_at_id' })
  user_delete: User;
}