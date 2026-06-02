import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAnioLectivoCalendarizacion20260428000200 implements MigrationInterface {
  name = 'CreateAnioLectivoCalendarizacion20260428000200';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create table if not exists catalogos.anio_lectivo_calendarizacion (
        id serial primary key,
        anio_lectivo_id smallint not null,
        corte_id integer not null,
        fecha_inicio date null,
        fecha_fin date null,
        observacion varchar(255) null,
        is_active boolean not null default true,
        user_create_id integer null,
        created_at timestamp not null default current_timestamp,
        update_at timestamp not null default current_timestamp,
        user_update_id integer null,
        deleted_at timestamp null,
        deleted_at_id integer null,
        constraint fk_anio_lectivo_calendarizacion_anio
          foreign key (anio_lectivo_id) references catalogos."anioLectivo"(id)
          on delete cascade,
        constraint fk_anio_lectivo_calendarizacion_corte
          foreign key (corte_id) references catalogos.cortes(id)
          on delete cascade,
        constraint ux_anio_lectivo_calendarizacion_anio_corte
          unique (anio_lectivo_id, corte_id)
      )
    `);

    await queryRunner.query(`
      create index if not exists idx_anio_lectivo_calendarizacion_anio
      on catalogos.anio_lectivo_calendarizacion(anio_lectivo_id)
    `);

    await queryRunner.query(`
      create index if not exists idx_anio_lectivo_calendarizacion_corte
      on catalogos.anio_lectivo_calendarizacion(corte_id)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('drop index if exists catalogos.idx_anio_lectivo_calendarizacion_corte');
    await queryRunner.query('drop index if exists catalogos.idx_anio_lectivo_calendarizacion_anio');
    await queryRunner.query('drop table if exists catalogos.anio_lectivo_calendarizacion');
  }
}