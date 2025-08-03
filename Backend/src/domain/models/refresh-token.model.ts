import { RefreshTokenStatus } from './enums/refresh-token-status.enum';

/** Persisted refresh token for session management */
export interface RefreshToken {
  /** Unique identifier */
  id: string;
  /** Associated user */
  userId: string;
  /** Hashed token */
  token: string;
  /** Optional device or fingerprint */
  device?: string;
  /** Issued timestamp */
  issuedAt: Date;
  /** Expiration timestamp */
  expiresAt: Date;
  /** Last time the token was used */
  lastUsedAt?: Date;
  /** Current token status */
  status: RefreshTokenStatus;
}
