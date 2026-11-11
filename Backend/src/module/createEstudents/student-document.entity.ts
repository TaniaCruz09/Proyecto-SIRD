import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StudentEntity } from './students.entity';

@Entity({ name: 'student_document', schema: 'estudiante' })
export class StudentDocument {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int4' })
  id: number;

  /** Nombre con el que el usuario identifica el documento (ej. "Cédula"). */
  @Column({ name: 'nombre', type: 'varchar', length: 120 })
  nombre: string;

  /** Ruta relativa servida por /uploads (ej. /uploads/documentos/estudiantes/xxx.pdf). */
  @Column({ name: 'archivo', type: 'varchar' })
  archivo: string;

  @Column({ name: 'tipo', type: 'varchar', length: 100, nullable: true })
  tipo: string;

  @Column({ name: 'tamano', type: 'int4', nullable: true })
  tamano: number;

  @ManyToOne(() => StudentEntity, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'student_id' })
  student: StudentEntity;

  @Column({ name: 'user_create_id', type: 'int4', nullable: true })
  userCreateId: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
