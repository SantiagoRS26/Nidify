import jwt from 'jsonwebtoken';
import { config } from '../../config/env';

export class JwtService {
  signAccess(userId: string, userName: string): string {
    return jwt.sign({ sub: userId, name: userName }, config.jwtSecret, {
      expiresIn: '15m',
    });
  }

  signRefresh(
    payload: {
      userId: string;
      userName: string;
      jti: string;
      familyId: string;
    },
    expiresIn: string | number = '7d',
  ): string {
    const { userId, userName, jti, familyId } = payload;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (jwt.sign as any)(
      { sub: userId, name: userName, jti, familyId },
      config.jwtRefreshSecret,
      { expiresIn },
    );
  }

  verifyAccess(token: string): { userId: string; userName: string } {
    const decoded = jwt.verify(token, config.jwtSecret) as {
      sub: string;
      name: string;
    };
    return { userId: decoded.sub, userName: decoded.name };
  }

  verifyRefresh(token: string): {
    userId: string;
    userName: string;
    jti: string;
    familyId: string;
  } {
    const decoded = jwt.verify(token, config.jwtRefreshSecret) as {
      sub: string;
      name: string;
      jti: string;
      familyId: string;
    };
    return {
      userId: decoded.sub,
      userName: decoded.name,
      jti: decoded.jti,
      familyId: decoded.familyId,
    };
  }

  decodeRefresh(token: string): { exp: number; iat: number } {
    const decoded = jwt.decode(token) as { exp: number; iat: number };
    return { exp: decoded.exp, iat: decoded.iat };
  }
}
