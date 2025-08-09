import { UserRepository } from '../../infrastructure/persistence/repositories/user.repository';
import { User } from '../../domain/models/user.model';
import { NotFoundError } from '../../domain/errors/not-found.error';

export class UpdatePreferredCurrencyUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string, currency: string): Promise<User> {
    const user = await this.userRepository.update(userId, {
      preferredCurrency: currency,
      updatedAt: new Date(),
    });
    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }
    return user;
  }
}
