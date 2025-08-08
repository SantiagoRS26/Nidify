import jwt from 'jsonwebtoken';
import { config } from '../../config/env';

export class JwtService {
  signAccess(userId: string): string {
    return jwt.sign({ sub: userId }, config.jwtSecret, { expiresIn: '15m' });
  }

  signRefresh(
    payload: { userId: string; jti: string; familyId: string },
    expiresIn: string | number = '7d',
  ): string {
    const { userId, jti, familyId } = payload;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (jwt.sign as any)(
      { sub: userId, jti, familyId },
      config.jwtRefreshSecret,
      { expiresIn },
    );
  }

  verifyAccess(token: string): { userId: string } {
    const decoded = jwt.verify(token, config.jwtSecret) as { sub: string };
    return { userId: decoded.sub };
  }

  verifyRefresh(token: string): {
    userId: string;
    jti: string;
    familyId: string;
  } {
    const decoded = jwt.verify(token, config.jwtRefreshSecret) as {
      sub: string;
      jti: string;
      familyId: string;
    };
    return {
      userId: decoded.sub,
      jti: decoded.jti,
      familyId: decoded.familyId,
    };
  }

  decodeRefresh(token: string): { exp: number; iat: number } {
    const decoded = jwt.decode(token) as { exp: number; iat: number };
    return { exp: decoded.exp, iat: decoded.iat };
  }
}
