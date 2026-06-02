import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTipoPeriodizacionIdToPeriodoLectivo20260428000100 implements MigrationInterface {
  name = 'AddTipoPeriodizacionIdToPeriodoLectivo20260428000100';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      alter table catalogos.periodo_lectivo
      add column if not exists tipo_periodizacion_id integer null
    `);

    await queryRunner.query(`
      do $$
      begin
        if not exists (
          select 1
          from information_schema.table_constraints
          where constraint_schema = 'catalogos'
            and table_name = 'periodo_lectivo'
            and constraint_name = 'fk_periodo_lectivo_tipo_periodizacion'
        ) then
          alter table catalogos.periodo_lectivo
          add constraint fk_periodo_lectivo_tipo_periodizacion
          foreign key (tipo_periodizacion_id)
          references catalogos.tipo_periodizacion(id)
          on delete set null;
        end if;
      end $$;
    `);

    await queryRunner.query(`
      create index if not exists idx_periodo_lectivo_tipo_periodizacion_id
      on catalogos.periodo_lectivo(tipo_periodizacion_id)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('drop index if exists catalogos.idx_periodo_lectivo_tipo_periodizacion_id');
    await queryRunner.query(`
      alter table catalogos.periodo_lectivo
      drop constraint if exists fk_periodo_lectivo_tipo_periodizacion
    `);
    await queryRunner.query(`
      alter table catalogos.periodo_lectivo
      drop column if exists tipo_periodizacion_id
    `);
  }
}