import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAnioLectivoCorte20260223000500 implements MigrationInterface {
  name = 'CreateAnioLectivoCorte20260223000500';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('create schema if not exists catalogos');
    await queryRunner.query(`
      create table if not exists catalogos.anio_lectivo_corte (
        anio_lectivo_id smallint not null,
        corte_id integer not null,
        primary key (anio_lectivo_id, corte_id),
        constraint fk_anio_lectivo_corte_anio
          foreign key (anio_lectivo_id)
          references catalogos."anioLectivo"(id)
          on delete cascade,
        constraint fk_anio_lectivo_corte_corte
          foreign key (corte_id)
          references catalogos.cortes(id)
          on delete cascade
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('drop table if exists catalogos.anio_lectivo_corte');
  }
}
