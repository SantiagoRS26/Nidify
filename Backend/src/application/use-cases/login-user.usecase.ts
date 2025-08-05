import bcrypt from 'bcryptjs';
import { UserRepository } from '../../infrastructure/persistence/repositories/user.repository';
import { JwtService } from '../../infrastructure/auth/jwt.service';
import { UnauthorizedError } from '../../domain/errors/unauthorized.error';

export class LoginUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async execute(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.passwordHash) {
      throw new UnauthorizedError('Credenciales inválidas');
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedError('Credenciales inválidas');
    }
    const { accessToken, refreshToken } = this.jwtService.generateTokens(user);
    return { user, accessToken, refreshToken };
  }
}
