import { OAuth2Client } from 'google-auth-library';
import { OAuthProvider, OAuthUserProfile } from './oauth-provider.interface';
import { config } from '../../config/env';
import { UnauthorizedError } from '../../domain/errors/unauthorized.error';

export class GoogleOAuthProvider implements OAuthProvider {
  name = 'google';
  private client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client(
      config.googleClientId,
      config.googleClientSecret,
      config.googleRedirectUri,
    );
  }

  getAuthorizationUrl(): string {
    return this.client.generateAuthUrl({
      scope: ['profile', 'email'],
      redirect_uri: config.googleRedirectUri,
      access_type: 'offline',
      prompt: 'consent',
    });
  }

  async getUserProfile(code: string): Promise<OAuthUserProfile> {
    const { tokens } = await this.client.getToken(code);
    const idToken = tokens.id_token;
    if (!idToken) {
      throw new UnauthorizedError('Token de Google inválido');
    }
    const ticket = await this.client.verifyIdToken({ idToken });
    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email || !payload.name) {
      throw new UnauthorizedError('Token de Google inválido');
    }
    return {
      externalId: payload.sub,
      email: payload.email,
      fullName: payload.name,
    };
  }
}
