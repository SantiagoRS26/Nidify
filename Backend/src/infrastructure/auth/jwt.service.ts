import jwt from 'jsonwebtoken';
import { config } from '../../config/env';
import { User } from '../../domain/models/user.model';

export class JwtService {
  signAccess(userId: string): string {
    return jwt.sign({ sub: userId }, config.jwtSecret, { expiresIn: '15m' });
  }

  signRefresh(userId: string): string {
    return jwt.sign({ sub: userId }, config.jwtRefreshSecret, {
      expiresIn: '7d',
    });
  }

  generateTokens(user: User): { accessToken: string; refreshToken: string } {
    return {
      accessToken: this.signAccess(user.id),
      refreshToken: this.signRefresh(user.id),
    };
  }

  verifyAccess(token: string): { userId: string } {
    const decoded = jwt.verify(token, config.jwtSecret) as {
      sub: string;
    };
    return { userId: decoded.sub };
  }

  verifyRefresh(token: string): { userId: string } {
    const decoded = jwt.verify(token, config.jwtRefreshSecret) as {
      sub: string;
    };
    return { userId: decoded.sub };
  }
}
