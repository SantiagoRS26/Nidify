import { OAuth2Client } from 'google-auth-library';
import { UserRepository } from '../../../infrastructure/persistence/repositories/user.repository';
import { User } from '../../../domain/models/user.model';
import { UnauthorizedError } from '../../../domain/errors/unauthorized.error';
import { NotFoundError } from '../../../domain/errors/not-found.error';

export class LinkGoogleUseCase {
  constructor(
    private userRepository: UserRepository,
    private googleClient: OAuth2Client,
  ) {}

  async execute(userId: string, idToken: string): Promise<User> {
    const ticket = await this.googleClient.verifyIdToken({ idToken });
    const payload = ticket.getPayload();
    if (!payload?.sub) {
      throw new UnauthorizedError('Token de Google inválido');
    }
    const externalId = payload.sub;
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }
    if (user.oauthProviders.some((p) => p.provider === 'google')) {
      return user;
    }
    await this.userRepository.update(user.id, {
      oauthProviders: [
        ...user.oauthProviders,
        { provider: 'google', externalId, linkedAt: new Date() },
      ],
    });
    return (await this.userRepository.findById(user.id))!;
  }
}
