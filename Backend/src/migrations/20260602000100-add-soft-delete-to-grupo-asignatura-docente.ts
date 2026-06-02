import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSoftDeleteToGrupoAsignaturaDocente20260602000100 implements MigrationInterface {
  name = 'AddSoftDeleteToGrupoAsignaturaDocente20260602000100';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      alter table organizacion_escolar.grupo_asignatura_docente
      add column if not exists activo boolean not null default true
    `);

    await queryRunner.query(`
      alter table organizacion_escolar.grupo_asignatura_docente
      add column if not exists deleted_at timestamp null
    `);

    await queryRunner.query(`
      alter table organizacion_escolar.grupo_asignatura_docente
      add column if not exists deleted_at_id int4 null
    `);

    await queryRunner.query(`
      alter table organizacion_escolar.grupo_asignatura_docente
      add column if not exists user_update_id int4 null
    `);

    await queryRunner.query(`
      alter table organizacion_escolar.grupo_asignatura_docente
      add column if not exists update_at timestamp null
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      alter table organizacion_escolar.grupo_asignatura_docente
      drop column if exists activo
    `);

    await queryRunner.query(`
      alter table organizacion_escolar.grupo_asignatura_docente
      drop column if exists deleted_at
    `);

    await queryRunner.query(`
      alter table organizacion_escolar.grupo_asignatura_docente
      drop column if exists deleted_at_id
    `);

    await queryRunner.query(`
      alter table organizacion_escolar.grupo_asignatura_docente
      drop column if exists user_update_id
    `);

    await queryRunner.query(`
      alter table organizacion_escolar.grupo_asignatura_docente
      drop column if exists update_at
    `);
  }
}
