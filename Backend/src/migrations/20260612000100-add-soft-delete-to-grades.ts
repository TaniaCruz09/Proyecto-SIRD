import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSoftDeleteToGrades20260612000100 implements MigrationInterface {
  name = 'AddSoftDeleteToGrades20260612000100';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      alter table catalogos.grades
      add column if not exists user_create_id int4 null
    `);

    await queryRunner.query(`
      alter table catalogos.grades
      add column if not exists created_at timestamp null default CURRENT_TIMESTAMP
    `);

    await queryRunner.query(`
      alter table catalogos.grades
      add column if not exists update_at timestamp null
    `);

    await queryRunner.query(`
      alter table catalogos.grades
      add column if not exists user_update_id int4 null
    `);

    await queryRunner.query(`
      alter table catalogos.grades
      add column if not exists deleted_at timestamp null
    `);

    await queryRunner.query(`
      alter table catalogos.grades
      add column if not exists deleted_at_id int4 null
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      alter table catalogos.grades
      drop column if exists user_create_id
    `);

    await queryRunner.query(`
      alter table catalogos.grades
      drop column if exists created_at
    `);

    await queryRunner.query(`
      alter table catalogos.grades
      drop column if exists update_at
    `);

    await queryRunner.query(`
      alter table catalogos.grades
      drop column if exists user_update_id
    `);

    await queryRunner.query(`
      alter table catalogos.grades
      drop column if exists deleted_at
    `);

    await queryRunner.query(`
      alter table catalogos.grades
      drop column if exists deleted_at_id
    `);
  }
}
