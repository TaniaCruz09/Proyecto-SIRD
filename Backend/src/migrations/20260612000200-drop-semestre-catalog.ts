import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropSemestreCatalog20260612000200 implements MigrationInterface {
  name = 'DropSemestreCatalog20260612000200';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Drop FK constraint if exists (pg will autogenerate names like fk_cortes_semestre_id)
    await queryRunner.query(`
      do $$
      declare
        fk_name text;
        col_name text;
      begin
        -- Find the FK column name (semestreId or semestre_id)
        select c.column_name into col_name
        from information_schema.columns c
        where c.table_schema = 'catalogos'
          and c.table_name = 'cortes'
          and c.column_name in ('semestreId', 'semestre_id', 'semestreid');

        if col_name is not null then
          -- Find and drop FK constraint
          select con.conname into fk_name
          from pg_catalog.pg_constraint con
          join pg_catalog.pg_class rel on rel.oid = con.conrelid
          join pg_catalog.pg_namespace nsp on nsp.oid = rel.relnamespace
          where nsp.nspname = 'catalogos'
            and rel.relname = 'cortes'
            and con.contype = 'f'
            and con.conkey = (
              select array_agg(att.attnum)
              from pg_catalog.pg_attribute att
              where att.attrelid = rel.oid
                and att.attname = col_name
            );

          if fk_name is not null then
            execute format('alter table catalogos.cortes drop constraint %I', fk_name);
          end if;

          -- Drop the column
          execute format('alter table catalogos.cortes drop column %I', col_name);
        end if;
      end $$;
    `);

    // 2. Drop the semestre table
    await queryRunner.query(`drop table if exists catalogos.semestre cascade`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Restore semestre table
    await queryRunner.query(`
      create table catalogos.semestre (
        id serial primary key,
        abreviatura varchar(30) not null,
        semestre varchar(30) not null,

        user_create_id int4 null,
        created_at timestamp null default CURRENT_TIMESTAMP,
        update_at timestamp null,
        user_update_id int4 null,
        deleted_at timestamp null,
        deleted_at_id int4 null
      )
    `);

    // Note: we can't fully restore the data or FK column automatically
  }
}
