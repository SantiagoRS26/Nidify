import bcrypt from 'bcryptjs';
import { UserRepository } from '../../infrastructure/persistence/repositories/user.repository';
import { UserStatus } from '../../domain/models/enums/user-status.enum';
import { User } from '../../domain/models/user.model';

export class RegisterUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(
    fullName: string,
    email: string,
    password: string,
  ): Promise<User> {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new Error('Correo electrónico ya en uso');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create({
      fullName,
      email,
      passwordHash,
      oauthProviders: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      status: UserStatus.ACTIVE,
    });
    return user;
  }
}
