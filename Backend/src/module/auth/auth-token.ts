export const AUTH_TOKEN_TYPE = {
  ACCESS: 'access',
  ROLE_SELECTION: 'role-selection',
} as const;

export type AuthTokenType =
  (typeof AUTH_TOKEN_TYPE)[keyof typeof AUTH_TOKEN_TYPE];

export type AuthTokenPayload = {
  sub: number;
  sid: string;
  type: AuthTokenType;
  name?: string;
  email?: string;
  roles: string[];
  activeRole?: string;
  sessionStartedAt: number;
};

export const MAX_SESSION_AGE_MS = 8 * 60 * 60 * 1000;
export const ROLE_SELECTION_TTL_MS = 10 * 60 * 1000;
