import { Invitation } from '../../../domain/models/invitation.model';
import { InvitationModel } from '../models/invitation.schema';

export class InvitationRepository {
  async create(invitation: Omit<Invitation, 'id'>): Promise<Invitation> {
    const created = await InvitationModel.create(invitation);
    return { id: created.id, ...created.toObject() } as unknown as Invitation;
  }

  async findByToken(token: string): Promise<Invitation | null> {
    return (await InvitationModel.findOne({
      token,
    }).lean()) as Invitation | null;
  }

  async update(
    id: string,
    update: Partial<Invitation>,
  ): Promise<Invitation | null> {
    return (await InvitationModel.findByIdAndUpdate(id, update, {
      new: true,
    }).lean()) as Invitation | null;
  }
}
