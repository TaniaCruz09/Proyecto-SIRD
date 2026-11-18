import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'auth', name: 'rate_limit_buckets' })
@Index('idx_auth_rate_limit_reset_at', ['resetAt'])
export class AuthRateLimitBucket {
  @PrimaryColumn({ name: 'bucket_key', type: 'char', length: 64 })
  bucketKey: string;

  @Column({ name: 'hit_count', type: 'int4' })
  hitCount: number;

  @Column({ name: 'reset_at', type: 'timestamptz' })
  resetAt: Date;
}
