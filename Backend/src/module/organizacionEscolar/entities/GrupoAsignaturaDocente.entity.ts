// src/module/organizacionEscolar/entities/grupoAsignaturaDocente.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Grupos } from "./grupos.entity";
import { Asignatura } from "src/module/catalogos";
import { Docentes } from "src/module/docentes/docentes.entity";
import { GrupoAsignaturaConEstudiantes } from "./grupo-asignatura-con-estudiantes.entity";

@Entity({ name: 'grupo_asignatura_docente', schema: 'organizacion_escolar' })
export class GrupoAsignaturaDocente {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Grupos, (grupo) => grupo.id, { eager: true })
  @JoinColumn({ name: 'grupo_id' })
  grupo: Grupos;

  @ManyToOne(() => Asignatura, (asignatura) => asignatura.id, { eager: true })
  @JoinColumn({ name: 'asignatura_id' })
  asignatura: Asignatura;

  @ManyToOne(() => Docentes, (docente) => docente.id, { eager: true })
  @JoinColumn({ name: 'docente_id' })
  docente: Docentes;

  @OneToMany(
    () => GrupoAsignaturaConEstudiantes,
    gruposConEstudiantes => gruposConEstudiantes.grupoAsignaturaDocente,
  )
  gruposConEstudiantes: GrupoAsignaturaConEstudiantes[];
}
