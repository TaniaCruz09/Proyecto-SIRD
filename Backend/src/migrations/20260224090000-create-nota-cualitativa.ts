import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNotaCualitativa20260224090000 implements MigrationInterface {
  name = "CreateNotaCualitativa20260224090000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("create schema if not exists catalogos");
    await queryRunner.query(`
      create table if not exists catalogos."notaCualitativa" (
        id serial primary key,
        nombre varchar(100) not null,
        abreviatura varchar(20) not null,
        rango_menor integer not null,
        rango_mayor integer not null,
        user_create_id int4 null,
        created_at timestamp default CURRENT_TIMESTAMP,
        update_at timestamp default CURRENT_TIMESTAMP,
        user_update_id int4 null,
        deleted_at timestamp null,
        deleted_at_id int4 null
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('drop table if exists catalogos."notaCualitativa"');
  }
}
