/* eslint-env jest */
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import { JwtService } from '../../auth/jwt.service';
import { RefreshTokenService } from '../../auth/refresh-token.service';
import { RefreshTokenRepository } from '../../persistence/repositories/refresh-token.repository';
import { RefreshTokenStatus } from '../../../domain/models/enums/refresh-token-status.enum';
import { UnauthorizedError } from '../../../domain/errors/unauthorized.error';

let mongo: MongoMemoryServer;
let service: RefreshTokenService;
let repository: RefreshTokenRepository;
let jwtService: JwtService;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

beforeEach(async () => {
  await mongoose.connection.db.dropDatabase();
  jwtService = new JwtService();
  repository = new RefreshTokenRepository();
  service = new RefreshTokenService(jwtService, repository);
});

describe('RefreshTokenService rotation', () => {
  it('marks family as compromised on reuse', async () => {
    const { refreshToken } = await service.issue('user1');
    const first = await service.rotate(refreshToken);
    await expect(service.rotate(refreshToken)).rejects.toBeInstanceOf(
      UnauthorizedError,
    );
    const jti1 = jwtService.verifyRefresh(refreshToken).jti;
    const jti2 = jwtService.verifyRefresh(first.refreshToken).jti;
    const stored1 = await repository.findById(jti1);
    const stored2 = await repository.findById(jti2);
    expect(stored1?.status).toBe(RefreshTokenStatus.COMPROMISED);
    expect(stored2?.status).toBe(RefreshTokenStatus.COMPROMISED);
  });

  it('selective revocation does not affect other devices', async () => {
    const { refreshToken: tokenA } = await service.issue('user1');
    const { refreshToken: tokenB } = await service.issue('user1');
    await service.revoke(tokenA);
    await expect(service.rotate(tokenB)).resolves.toBeDefined();
    const jtiA = jwtService.verifyRefresh(tokenA).jti;
    const storedA = await repository.findById(jtiA);
    expect(storedA?.status).toBe(RefreshTokenStatus.REVOKED);
  });

  it('global revocation revokes familyId', async () => {
    const { refreshToken: token1 } = await service.issue('user1');
    const { refreshToken: token2 } = await service.rotate(token1);
    await service.revokeFamily(token2);
    const jti1 = jwtService.verifyRefresh(token1).jti;
    const jti2 = jwtService.verifyRefresh(token2).jti;
    const stored1 = await repository.findById(jti1);
    const stored2 = await repository.findById(jti2);
    expect(stored1?.status).toBe(RefreshTokenStatus.REVOKED);
    expect(stored2?.status).toBe(RefreshTokenStatus.REVOKED);
  });

  it('happy rotation issues new token and invalidates old', async () => {
    const { refreshToken: token1 } = await service.issue('user1');
    const { refreshToken: token2 } = await service.rotate(token1);
    await expect(service.rotate(token2)).resolves.toBeDefined();
    await expect(service.rotate(token1)).rejects.toBeInstanceOf(
      UnauthorizedError,
    );
  });

  it('expired refresh token returns 401 without state change', async () => {
    const { refreshToken } = await service.issue('user1', undefined, '1ms');
    const { jti } = jwt.decode(refreshToken) as { jti: string };
    await new Promise((r) => setTimeout(r, 10));
    await expect(service.rotate(refreshToken)).rejects.toBeInstanceOf(
      UnauthorizedError,
    );
    const stored = await repository.findById(jti);
    expect(stored?.status).toBe(RefreshTokenStatus.ACTIVE);
  });
});
