import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFkNotaCualitativaToEsquelaRow20260629001000 implements MigrationInterface {
  name = 'AddFkNotaCualitativaToEsquelaRow20260629001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Agregar columna nota_cualitativa_id (nullable inicialmente)
    await queryRunner.query(`
      alter table calificaciones.esquela_row
        add column nota_cualitativa_id int4 null;
    `);

    // 2. Migrar datos existentes: buscar el id en catalogos.notaCualitativa
    //    comparando el varchar nota_cualitativa con la abreviatura
    await queryRunner.query(`
      update calificaciones.esquela_row er
        set nota_cualitativa_id = nc.id
        from catalogos."notaCualitativa" nc
        where er.nota_cualitativa = nc.abreviatura;
    `);

    // 3. Hacer la columna NOT NULL después de migrar datos
    await queryRunner.query(`
      alter table calificaciones.esquela_row
        alter column nota_cualitativa_id set not null;
    `);

    // 4. Agregar FK constraint
    await queryRunner.query(`
      alter table calificaciones.esquela_row
        add constraint fk_esquela_row_nota_cualitativa
        foreign key (nota_cualitativa_id)
        references catalogos."notaCualitativa"(id);
    `);

    // 5. Eliminar la columna varchar vieja (opcional, se puede dejar para respaldo)
    await queryRunner.query(`
      alter table calificaciones.esquela_row
        drop column nota_cualitativa;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Restaurar columna varchar
    await queryRunner.query(`
      alter table calificaciones.esquela_row
        add column nota_cualitativa varchar null;
    `);

    // Restaurar datos desde la FK
    await queryRunner.query(`
      update calificaciones.esquela_row er
        set nota_cualitativa = nc.abreviatura
        from catalogos."notaCualitativa" nc
        where er.nota_cualitativa_id = nc.id;
    `);

    // Eliminar FK y columna nueva
    await queryRunner.query(`
      alter table calificaciones.esquela_row
        drop constraint if exists fk_esquela_row_nota_cualitativa;
    `);

    await queryRunner.query(`
      alter table calificaciones.esquela_row
        drop column nota_cualitativa_id;
    `);
  }
}
