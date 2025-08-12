import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from './jwt.service';
import { RefreshTokenRepository } from '../persistence/repositories/refresh-token.repository';
import { RefreshTokenStatus } from '../../domain/models/enums/refresh-token-status.enum';
import { UnauthorizedError } from '../../domain/errors/unauthorized.error';
import { RefreshToken } from '../../domain/models/refresh-token.model';

export class RefreshTokenService {
  constructor(
    private jwtService: JwtService,
    private repository: RefreshTokenRepository,
  ) {}

  private hash(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async issue(
    userId: string,
    userName: string,
    familyId?: string,
    expiresIn = '7d',
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const jti = uuidv4();
    const family = familyId ?? uuidv4();
    const refreshToken = this.jwtService.signRefresh(
      { userId, userName, jti, familyId: family },
      expiresIn,
    );
    const { exp, iat } = this.jwtService.decodeRefresh(refreshToken);
    const token: RefreshToken = {
      id: jti,
      userId,
      familyId: family,
      token: this.hash(refreshToken),
      issuedAt: new Date(iat * 1000),
      expiresAt: new Date(exp * 1000),
      status: RefreshTokenStatus.ACTIVE,
    };
    await this.repository.create(token);
    const accessToken = this.jwtService.signAccess(userId, userName);
    return { accessToken, refreshToken };
  }

  async rotate(
    oldToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    let payload: {
      userId: string;
      userName: string;
      jti: string;
      familyId: string;
    };
    try {
      payload = this.jwtService.verifyRefresh(oldToken);
    } catch {
      throw new UnauthorizedError('Invalid refresh token');
    }
    const stored = await this.repository.findById(payload.jti);
    const hash = this.hash(oldToken);
    if (
      !stored ||
      stored.token !== hash ||
      stored.status !== RefreshTokenStatus.ACTIVE
    ) {
      await this.repository.markFamilyCompromised(payload.familyId);
      throw new UnauthorizedError('Refresh token reuse detected');
    }
    await this.repository.update(payload.jti, {
      status: RefreshTokenStatus.ROTATED,
      lastUsedAt: new Date(),
    });
    return this.issue(payload.userId, payload.userName, payload.familyId);
  }

  async revoke(token: string): Promise<void> {
    try {
      const { jti } = this.jwtService.verifyRefresh(token);
      await this.repository.update(jti, {
        status: RefreshTokenStatus.REVOKED,
        lastUsedAt: new Date(),
      });
    } catch {
      /* ignore */
    }
  }

  async revokeFamily(token: string): Promise<void> {
    try {
      const { familyId } = this.jwtService.verifyRefresh(token);
      await this.repository.revokeFamily(familyId);
    } catch {
      /* ignore */
    }
  }
}
