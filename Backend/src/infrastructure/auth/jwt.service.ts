import jwt from 'jsonwebtoken';
import { config } from '../../config/env';
import { User } from '../../domain/models/user.model';

export class JwtService {
  sign(user: User): string {
    return jwt.sign({ sub: user.id }, config.jwtSecret, { expiresIn: '7d' });
  }

  verify(token: string): { userId: string } {
    const decoded = jwt.verify(token, config.jwtSecret) as { sub: string };
    return { userId: decoded.sub };
  }
}
