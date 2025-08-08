import { RefreshToken } from '../../../domain/models/refresh-token.model';
import { RefreshTokenModel } from '../models/refresh-token.schema';
import { RefreshTokenStatus } from '../../../domain/models/enums/refresh-token-status.enum';

export class RefreshTokenRepository {
  async create(token: RefreshToken): Promise<void> {
    await RefreshTokenModel.create({ _id: token.id, ...token });
  }

  async findById(id: string): Promise<RefreshToken | null> {
    return (await RefreshTokenModel.findById(id).lean()) as RefreshToken | null;
  }

  async update(id: string, update: Partial<RefreshToken>): Promise<void> {
    await RefreshTokenModel.findByIdAndUpdate(id, update).lean();
  }

  async revokeFamily(familyId: string): Promise<void> {
    await RefreshTokenModel.updateMany(
      { familyId },
      { status: RefreshTokenStatus.REVOKED },
    ).lean();
  }

  async markFamilyCompromised(familyId: string): Promise<void> {
    await RefreshTokenModel.updateMany(
      { familyId },
      { status: RefreshTokenStatus.COMPROMISED },
    ).lean();
  }
}
