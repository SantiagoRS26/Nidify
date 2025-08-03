import { UserStatus } from './enums/user-status.enum';

/**
 * User represents a person interacting with the application.
 * It can belong to multiple households through memberships.
 */
export interface OAuthProviderLink {
  /** OAuth provider name, e.g., 'google' */
  provider: string;
  /** External ID provided by the OAuth provider */
  externalId: string;
  /** When the provider was linked */
  linkedAt: Date;
}

export interface User {
  /** Unique identifier */
  id: string;
  /** Full name for UI and changelog */
  fullName: string;
  /** Email address, unique */
  email: string;
  /** Password hash for email/password logins */
  passwordHash?: string;
  /** Linked OAuth providers */
  oauthProviders: OAuthProviderLink[];
  /** Preferred currency ISO code, e.g., 'USD' */
  preferredCurrency?: string;
  /** Locale configuration */
  locale?: string;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
  /** User status for soft delete or access revocation */
  status: UserStatus;
}
