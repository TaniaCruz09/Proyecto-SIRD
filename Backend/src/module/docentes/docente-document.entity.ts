import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Docentes } from './docentes.entity';

@Entity({ name: 'docente_document', schema: 'docentes' })
export class DocenteDocument {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int4' })
  id: number;

  /** Nombre con el que el usuario identifica el documento (ej. "Cédula"). */
  @Column({ name: 'nombre', type: 'varchar', length: 120 })
  nombre: string;

  /** Ruta relativa servida por /uploads (ej. /uploads/documentos/docentes/xxx.pdf). */
  @Column({ name: 'archivo', type: 'varchar' })
  archivo: string;

  @Column({ name: 'tipo', type: 'varchar', length: 100, nullable: true })
  tipo: string;

  @Column({ name: 'tamano', type: 'int4', nullable: true })
  tamano: number;

  @ManyToOne(() => Docentes, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'docente_id' })
  docente: Docentes;

  @Column({ name: 'user_create_id', type: 'int4', nullable: true })
  userCreateId: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
