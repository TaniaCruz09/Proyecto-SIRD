import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddModalidadIdToAnioLectivoCalendarizacion20260520000100
  implements MigrationInterface
{
  name = 'AddModalidadIdToAnioLectivoCalendarizacion20260520000100';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Agregar columna modalidad_id (nullable primero para datos existentes)
    await queryRunner.query(`
      alter table catalogos.anio_lectivo_calendarizacion
        add column modalidad_id int4 null
    `);

    // 2. Asignar modalidad_id por defecto a la primera modalidad existente
    //    para los registros que ya existen
    await queryRunner.query(`
      update catalogos.anio_lectivo_calendarizacion cal
        set modalidad_id = (
          select id from catalogos.modalidad
          order by id asc
          limit 1
        )
        where cal.modalidad_id is null
    `);

    // 3. Ahora hacer NOT NULL
    await queryRunner.query(`
      alter table catalogos.anio_lectivo_calendarizacion
        alter column modalidad_id set not null
    `);

    // 4. Agregar FK a modalidad
    await queryRunner.query(`
      alter table catalogos.anio_lectivo_calendarizacion
        add constraint fk_anio_lectivo_calendarizacion_modalidad
          foreign key (modalidad_id)
          references catalogos.modalidad(id)
          on delete cascade
    `);

    // 5. Eliminar el unique constraint anterior
    await queryRunner.query(`
      alter table catalogos.anio_lectivo_calendarizacion
        drop constraint if exists ux_anio_lectivo_calendarizacion_anio_corte
    `);

    // 6. Eliminar el index único de TypeORM si existe
    await queryRunner.query(`
      drop index if exists catalogos.ux_anio_lectivo_calendarizacion_anio_corte
    `);

    // 7. Crear el nuevo unique constraint incluyendo modalidad_id
    await queryRunner.query(`
      alter table catalogos.anio_lectivo_calendarizacion
        add constraint ux_anio_lectivo_calendarizacion_anio_modalidad_corte
          unique (anio_lectivo_id, modalidad_id, corte_id)
    `);

    // 8. Índice para búsquedas por modalidad
    await queryRunner.query(`
      create index if not exists idx_anio_lectivo_calendarizacion_modalidad
        on catalogos.anio_lectivo_calendarizacion(modalidad_id)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'drop index if exists catalogos.idx_anio_lectivo_calendarizacion_modalidad',
    );
    await queryRunner.query(
      'drop constraint if exists catalogos.ux_anio_lectivo_calendarizacion_anio_modalidad_corte',
    );
    await queryRunner.query(
      'alter table catalogos.anio_lectivo_calendarizacion drop column modalidad_id',
    );
    await queryRunner.query(`
      alter table catalogos.anio_lectivo_calendarizacion
        add constraint ux_anio_lectivo_calendarizacion_anio_corte
          unique (anio_lectivo_id, corte_id)
    `);
  }
}
