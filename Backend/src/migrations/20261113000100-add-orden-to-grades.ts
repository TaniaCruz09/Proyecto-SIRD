import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Agrega la secuencia de los grados, necesaria para calcular el grado
 * siguiente al promocionar estudiantes (Séptimo -> Octavo -> Noveno).
 */
export class AddOrdenToGrades20261113000100 implements MigrationInterface {
  name = 'AddOrdenToGrades20261113000100';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      alter table catalogos.grades
      add column if not exists orden int4 null
    `);

    // Rellena la secuencia respetando el orden en que se crearon los grados.
    await queryRunner.query(`
      with secuencia as (
        select id, row_number() over (order by id) as posicion
        from catalogos.grades
        where deleted_at is null
      )
      update catalogos.grades grades
      set orden = secuencia.posicion
      from secuencia
      where grades.id = secuencia.id
        and grades.orden is null
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      alter table catalogos.grades
      drop column if exists orden
    `);
  }
}
