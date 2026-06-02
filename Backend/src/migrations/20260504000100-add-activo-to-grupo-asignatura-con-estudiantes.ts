import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddActivoToGrupoAsignaturaConEstudiantes20260504000100 implements MigrationInterface {
  name = 'AddActivoToGrupoAsignaturaConEstudiantes20260504000100';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      alter table organizacion_escolar.grupo_asignatura_con_estudiantes
      add column if not exists activo boolean not null default true
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      alter table organizacion_escolar.grupo_asignatura_con_estudiantes
      drop column if exists activo
    `);
  }
}