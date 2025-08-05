import { OAuth2Client } from 'google-auth-library';
import { UserRepository } from '../../infrastructure/persistence/repositories/user.repository';
import { JwtService } from '../../infrastructure/auth/jwt.service';
import { User } from '../../domain/models/user.model';
import { UserStatus } from '../../domain/models/enums/user-status.enum';
import { UnauthorizedError } from '../../domain/errors/unauthorized.error';

export class GoogleAuthUseCase {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private googleClient: OAuth2Client,
  ) {}

  async execute(
    idToken: string,
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const ticket = await this.googleClient.verifyIdToken({ idToken });
    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email || !payload.name) {
      throw new UnauthorizedError('Token de Google inválido');
    }
    const externalId = payload.sub;
    const email = payload.email;
    const name = payload.name;
    let user = await this.userRepository.findByEmail(email);
    if (!user) {
      user = await this.userRepository.create({
        fullName: name,
        email,
        oauthProviders: [
          { provider: 'google', externalId, linkedAt: new Date() },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        status: UserStatus.ACTIVE,
      });
    } else if (!user.oauthProviders.some((p) => p.provider === 'google')) {
      await this.userRepository.update(user.id, {
        oauthProviders: [
          ...user.oauthProviders,
          { provider: 'google', externalId, linkedAt: new Date() },
        ],
      });
      user = (await this.userRepository.findById(user.id))!;
    }
    const { accessToken, refreshToken } = this.jwtService.generateTokens(user);
    return { user, accessToken, refreshToken };
  }
}
