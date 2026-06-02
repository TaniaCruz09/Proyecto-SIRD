import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as moment from 'moment-timezone';
import { User } from '../../auth/entities/user.entity';

@Entity({ schema: 'catalogos', name: 'tipo_periodizacion' })
export class TipoPeriodizacion {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', length: 60, name: 'nombre' })
  nombre: string;

  @Column({ type: 'int2', name: 'cantidad_periodos', default: 1 })
  cantidad_periodos: number;

  @Column({ type: 'varchar', length: 10, name: 'prefijo_abreviatura', nullable: true })
  prefijo_abreviatura?: string;

  @Column({ type: 'bool', name: 'is_active', default: true })
  isActive?: boolean;

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
  create_at: Date;

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
  user_updated_id: number;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  delete_at: Date;

  @Column({ name: 'deleted_at_id', type: 'int4', nullable: true })
  delete_at_id: number;

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
