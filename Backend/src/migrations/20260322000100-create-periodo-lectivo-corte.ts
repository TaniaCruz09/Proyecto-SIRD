import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePeriodoLectivoCorte20260322000100 implements MigrationInterface {
  name = 'CreatePeriodoLectivoCorte20260322000100';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('create schema if not exists catalogos');

    await queryRunner.query(`
      create table if not exists catalogos.periodo_lectivo (
        id serial primary key,
        anio_lectivo_id smallint not null,
        nombre varchar(60) not null,
        abreviatura varchar(20),
        tipo varchar(30) not null default 'PERSONALIZADO',
        orden smallint not null,
        constraint fk_periodo_lectivo_anio
          foreign key (anio_lectivo_id)
          references catalogos."anioLectivo"(id)
          on delete cascade,
        constraint ux_periodo_lectivo_anio_orden unique (anio_lectivo_id, orden)
      )
    `);

    await queryRunner.query(`
      create table if not exists catalogos.periodo_lectivo_corte (
        periodo_lectivo_id integer not null,
        corte_id integer not null,
        orden smallint,
        primary key (periodo_lectivo_id, corte_id),
        constraint fk_periodo_lectivo_corte_periodo
          foreign key (periodo_lectivo_id)
          references catalogos.periodo_lectivo(id)
          on delete cascade,
        constraint fk_periodo_lectivo_corte_corte
          foreign key (corte_id)
          references catalogos.cortes(id)
          on delete cascade
      )
    `);

    await queryRunner.query(`
      create index if not exists idx_periodo_lectivo_corte_corte_id
      on catalogos.periodo_lectivo_corte(corte_id)
    `);

    await queryRunner.query(`
      do $$
      declare
        semestre_col text;
      begin
        select c.column_name
          into semestre_col
        from information_schema.columns c
        where c.table_schema = 'catalogos'
          and c.table_name = 'cortes'
          and c.column_name in ('semestreId', 'semestre_id')
        order by case when c.column_name = 'semestreId' then 0 else 1 end
        limit 1;

        if semestre_col is not null then
          execute format($f$
            insert into catalogos.periodo_lectivo (anio_lectivo_id, nombre, abreviatura, tipo, orden)
            select src.anio_lectivo_id,
                   coalesce(src.semestre_nombre, 'Periodo') as nombre,
                   src.semestre_abreviatura,
                   'SEMESTRE' as tipo,
                   dense_rank() over (
                     partition by src.anio_lectivo_id
                     order by src.semestre_id nulls last
                   ) as orden
            from (
              select distinct
                alc.anio_lectivo_id,
                s.id as semestre_id,
                s.semestre as semestre_nombre,
                s.abreviatura as semestre_abreviatura
              from catalogos.anio_lectivo_corte alc
              join catalogos.cortes c on c.id = alc.corte_id
              left join catalogos.semestre s on s.id = c.%I
            ) src
            on conflict (anio_lectivo_id, orden) do nothing
          $f$, semestre_col);

          execute format($f$
            insert into catalogos.periodo_lectivo_corte (periodo_lectivo_id, corte_id, orden)
            select p.id,
                   alc.corte_id,
                   row_number() over (
                     partition by p.id
                     order by alc.corte_id
                   ) as orden
            from catalogos.anio_lectivo_corte alc
            join catalogos.cortes c on c.id = alc.corte_id
            left join catalogos.semestre s on s.id = c.%I
            join catalogos.periodo_lectivo p
              on p.anio_lectivo_id = alc.anio_lectivo_id
             and p.tipo = 'SEMESTRE'
             and p.nombre = coalesce(s.semestre, 'Periodo')
             and coalesce(p.abreviatura, '') = coalesce(s.abreviatura, '')
            on conflict (periodo_lectivo_id, corte_id) do nothing
          $f$, semestre_col);
        else
          insert into catalogos.periodo_lectivo (anio_lectivo_id, nombre, abreviatura, tipo, orden)
          select distinct alc.anio_lectivo_id, 'Periodo 1', 'P1', 'PERSONALIZADO', 1
          from catalogos.anio_lectivo_corte alc
          where not exists (
            select 1
            from catalogos.periodo_lectivo p
            where p.anio_lectivo_id = alc.anio_lectivo_id
              and p.orden = 1
          );

          insert into catalogos.periodo_lectivo_corte (periodo_lectivo_id, corte_id, orden)
          select p.id,
                 alc.corte_id,
                 row_number() over (
                   partition by p.id
                   order by alc.corte_id
                 ) as orden
          from catalogos.anio_lectivo_corte alc
          join catalogos.periodo_lectivo p
            on p.anio_lectivo_id = alc.anio_lectivo_id
           and p.orden = 1
          on conflict (periodo_lectivo_id, corte_id) do nothing;
        end if;
      end $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('drop table if exists catalogos.periodo_lectivo_corte');
    await queryRunner.query('drop table if exists catalogos.periodo_lectivo');
  }
}
