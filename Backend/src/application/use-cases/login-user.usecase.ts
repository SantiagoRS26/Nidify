import bcrypt from 'bcryptjs';
import { UserRepository } from '../../infrastructure/persistence/repositories/user.repository';
import { JwtService } from '../../infrastructure/auth/jwt.service';

export class LoginUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async execute(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.passwordHash) {
      throw new Error('Invalid credentials');
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new Error('Invalid credentials');
    }
    const token = this.jwtService.sign(user);
    return { user, token };
  }
}
