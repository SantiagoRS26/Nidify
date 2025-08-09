export interface OAuthUserProfile {
  externalId: string;
  email: string;
  fullName: string;
}

export interface OAuthProvider {
  name: string;
  getAuthorizationUrl(): string;
  getUserProfile(code: string): Promise<OAuthUserProfile>;
}
