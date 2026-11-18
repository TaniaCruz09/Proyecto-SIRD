import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuthSecurityTables20261118000100
  implements MigrationInterface
{
  name = 'CreateAuthSecurityTables20261118000100';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create table if not exists auth.auth_sessions (
        id uuid primary key,
        user_id int4 not null references auth.users(id) on delete cascade,
        active_role varchar(100) null,
        session_started_at timestamptz not null,
        expires_at timestamptz not null,
        revoked_at timestamptz null
      )
    `);
    await queryRunner.query(`
      create index if not exists idx_auth_sessions_user_id
      on auth.auth_sessions (user_id)
    `);
    await queryRunner.query(`
      create index if not exists idx_auth_sessions_expires_at
      on auth.auth_sessions (expires_at)
    `);
    await queryRunner.query(`
      create table if not exists auth.rate_limit_buckets (
        bucket_key char(64) primary key,
        hit_count int4 not null,
        reset_at timestamptz not null
      )
    `);
    await queryRunner.query(`
      create index if not exists idx_auth_rate_limit_reset_at
      on auth.rate_limit_buckets (reset_at)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('drop table if exists auth.rate_limit_buckets');
    await queryRunner.query('drop table if exists auth.auth_sessions');
  }
}
