import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSoftDeleteToEsquelaRow20260428000300 implements MigrationInterface {
  name = 'AddSoftDeleteToEsquelaRow20260428000300';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      alter table calificaciones.esquela_row
      add column if not exists deleted_at timestamp null
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      alter table calificaciones.esquela_row
      drop column if exists deleted_at
    `);
  }
}