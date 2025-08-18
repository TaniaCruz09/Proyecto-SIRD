import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrganizacionLaboral } from "../organizacionLaboral/organizacionLaboral.entity";
import { Grupos } from "src/module/grupos/entities/grupos.entity";
import { Asignatura } from "src/module/catalogos";
import { User } from "src/module/auth/entities";


@Entity({ name: 'asignaturaGrupo', schema: 'asignaturagrupo' })
export class OrganizacionLaboralAsignaturaGrupo {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int2' })
  id: number;

  @ManyToOne(() => OrganizacionLaboral, (org) => org.organizacionLaboral)
  @JoinColumn({ name: 'organizacion_laboral_id' })
  organizacionLaboral: OrganizacionLaboral;

  @ManyToOne(() => Grupos, (grupo) => grupo.grupo)
  @JoinColumn({ name: 'grupo_id' })
  grupo: Grupos;

  @ManyToOne(() => Asignatura, (asignatura) => asignatura.asignaturasGrupos)
  @JoinColumn({ name: 'asignatura_id' })
  asignatura: Asignatura;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_create_id' })
  user_create: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_update_id' })
  user_update: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'deleted_at_id' })
  user_delete: User;

  @Column({ name: 'user_create_id', type: 'int4', nullable: true })
  user_create_id: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'update_at', type: 'timestamp' })
  update_at: Date;

  @Column({ name: 'user_update_id', type: 'int4', nullable: true })
  user_update_id: number;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deleted_at: Date;

  @Column({ name: 'deleted_at_id', type: 'int4', nullable: true })
  deleted_at_id: number;
}

