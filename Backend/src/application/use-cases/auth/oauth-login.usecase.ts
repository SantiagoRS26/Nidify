import { UserRepository } from '../../../infrastructure/persistence/repositories/user.repository';
import { OAuthProvider } from '../../../infrastructure/auth/oauth-provider.interface';
import { User } from '../../../domain/models/user.model';
import { UserStatus } from '../../../domain/models/enums/user-status.enum';

export class OAuthLoginUseCase {
  constructor(
    private userRepository: UserRepository,
    private provider: OAuthProvider,
  ) {}

  async execute(code: string): Promise<{ user: User }> {
    const profile = await this.provider.getUserProfile(code);
    const { externalId, email, fullName } = profile;
    let user = await this.userRepository.findByEmail(email);
    if (!user) {
      user = await this.userRepository.create({
        fullName,
        email,
        oauthProviders: [
          { provider: this.provider.name, externalId, linkedAt: new Date() },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        status: UserStatus.ACTIVE,
      });
    } else if (
      !user.oauthProviders.some((p) => p.provider === this.provider.name)
    ) {
      await this.userRepository.update(user.id, {
        oauthProviders: [
          ...user.oauthProviders,
          { provider: this.provider.name, externalId, linkedAt: new Date() },
        ],
      });
      user = (await this.userRepository.findById(user.id))!;
    }
    return { user };
  }
}
