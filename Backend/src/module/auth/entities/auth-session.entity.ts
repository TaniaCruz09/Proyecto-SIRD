import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'auth', name: 'auth_sessions' })
@Index('idx_auth_sessions_user_id', ['userId'])
@Index('idx_auth_sessions_expires_at', ['expiresAt'])
export class AuthSession {
  @PrimaryColumn({ name: 'id', type: 'uuid' })
  id: string;

  @Column({ name: 'user_id', type: 'int4' })
  userId: number;

  @Column({ name: 'active_role', type: 'varchar', length: 100, nullable: true })
  activeRole: string | null;

  @Column({ name: 'session_started_at', type: 'timestamptz' })
  sessionStartedAt: Date;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @Column({ name: 'revoked_at', type: 'timestamptz', nullable: true })
  revokedAt: Date | null;
}
