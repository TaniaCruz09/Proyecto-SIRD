import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * La cédula y el código de un registro eliminado (borrado lógico) dejan de
 * bloquear: la unicidad pasa a ser un índice parcial que solo cubre registros
 * activos (`deleted_at IS NULL`).
 */
export class LiberarCedulaAlEliminar20261112000100
  implements MigrationInterface
{
  name = 'LiberarCedulaAlEliminar20261112000100';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Quita las restricciones únicas globales (nombres generados por TypeORM).
    await queryRunner.query(`
      do $$
      declare c record;
      begin
        for c in
          select con.conname, nsp.nspname as schema_name, rel.relname as table_name
          from pg_constraint con
          join pg_class rel on rel.oid = con.conrelid
          join pg_namespace nsp on nsp.oid = rel.relnamespace
          where con.contype = 'u'
            and (
              (nsp.nspname = 'estudiante' and rel.relname = 'student'
                and pg_get_constraintdef(con.oid) ilike '%(cedula_identidad)%')
              or
              (nsp.nspname = 'estudiante' and rel.relname = 'student'
                and pg_get_constraintdef(con.oid) ilike '%(codigo_estudiante)%')
              or
              (nsp.nspname = 'docentes' and rel.relname = 'docentes'
                and pg_get_constraintdef(con.oid) ilike '%(cedula_identidad)%')
            )
        loop
          execute format(
            'alter table %I.%I drop constraint %I',
            c.schema_name, c.table_name, c.conname
          );
        end loop;
      end $$;
    `);

    await queryRunner.query(`
      create unique index if not exists uq_student_cedula_activa
      on estudiante.student (cedula_identidad)
      where cedula_identidad is not null and deleted_at is null
    `);

    await queryRunner.query(`
      create unique index if not exists uq_student_codigo_activo
      on estudiante.student (codigo_estudiante)
      where codigo_estudiante is not null and deleted_at is null
    `);

    await queryRunner.query(`
      create unique index if not exists uq_docente_cedula_activa
      on docentes.docentes (cedula_identidad)
      where cedula_identidad is not null and deleted_at is null
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`drop index if exists estudiante.uq_student_cedula_activa`);
    await queryRunner.query(`drop index if exists estudiante.uq_student_codigo_activo`);
    await queryRunner.query(`drop index if exists docentes.uq_docente_cedula_activa`);

    await queryRunner.query(`
      alter table estudiante.student
      add constraint uq_student_cedula_identidad unique (cedula_identidad)
    `);

    await queryRunner.query(`
      alter table estudiante.student
      add constraint uq_student_codigo_estudiante unique (codigo_estudiante)
    `);

    await queryRunner.query(`
      alter table docentes.docentes
      add constraint uq_docente_cedula_identidad unique (cedula_identidad)
    `);
  }
}
