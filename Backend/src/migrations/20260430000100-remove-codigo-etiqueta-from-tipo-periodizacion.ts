import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveCodigoEtiquetaFromTipoPeriodizacion20260430000100 implements MigrationInterface {
  name = 'RemoveCodigoEtiquetaFromTipoPeriodizacion20260430000100';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      alter table catalogos.tipo_periodizacion
      drop column if exists codigo,
      drop column if exists etiqueta_periodo
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      alter table catalogos.tipo_periodizacion
      add column if not exists codigo varchar(30),
      add column if not exists etiqueta_periodo varchar(40)
    `);

    await queryRunner.query(`
      update catalogos.tipo_periodizacion
      set
        codigo = coalesce(nullif(upper(prefijo_abreviatura), ''), upper(regexp_replace(nombre, '[^A-Za-z0-9]+', '_', 'g'))),
        etiqueta_periodo = nombre
      where codigo is null or etiqueta_periodo is null
    `);

    await queryRunner.query(`
      alter table catalogos.tipo_periodizacion
      alter column codigo set not null
    `);

    await queryRunner.query(`
      do $$
      begin
        if not exists (
          select 1
          from pg_constraint
          where conname = 'UQ_tipo_periodizacion_codigo'
        ) then
          alter table catalogos.tipo_periodizacion
          add constraint UQ_tipo_periodizacion_codigo unique (codigo);
        end if;
      end $$;
    `);
  }
}