import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTipoPeriodizacion20260326001000 implements MigrationInterface {
  name = 'CreateTipoPeriodizacion20260326001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create table if not exists catalogos.tipo_periodizacion (
        id serial primary key,
        codigo varchar(30) not null unique,
        nombre varchar(60) not null,
        cantidad_periodos smallint not null default 1,
        etiqueta_periodo varchar(40),
        prefijo_abreviatura varchar(10),
        is_active boolean not null default true,
        user_create_id integer,
        created_at timestamp without time zone default now(),
        update_at timestamp without time zone default now(),
        user_update_id integer,
        deleted_at timestamp without time zone,
        deleted_at_id integer
      );
    `);

    await queryRunner.query(`
      insert into catalogos.tipo_periodizacion
        (codigo, nombre, cantidad_periodos, etiqueta_periodo, prefijo_abreviatura, is_active)
      values
        ('SEMESTRE', 'Semestral', 2, 'Semestre', 'S', true),
        ('CUATRIMESTRE', 'Cuatrimestral', 3, 'Cuatrimestre', 'C', true),
        ('TRIMESTRE', 'Trimestral', 4, 'Trimestre', 'T', true),
        ('BIMESTRE', 'Bimestral', 6, 'Bimestre', 'B', true),
        ('PERSONALIZADO', 'Personalizado', 1, 'Periodo', 'P', true)
      on conflict (codigo) do nothing;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('drop table if exists catalogos.tipo_periodizacion');
  }
}
