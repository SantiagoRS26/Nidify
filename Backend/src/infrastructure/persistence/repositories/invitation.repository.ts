import { Invitation } from '../../../domain/models/invitation.model';
import { InvitationModel } from '../models/invitation.schema';

type InvitationRecord = Omit<Invitation, 'id'> & { _id: unknown };

export class InvitationRepository {
  private toDomain(doc: InvitationRecord): Invitation {
    const { _id, ...invitation } = doc;
    return { id: String(_id), ...invitation } as Invitation;
  }

  async create(invitation: Omit<Invitation, 'id'>): Promise<Invitation> {
    const created = await InvitationModel.create(invitation);
    return this.toDomain(created.toObject() as InvitationRecord);
  }

  async findByToken(token: string): Promise<Invitation | null> {
    const doc = await InvitationModel.findOne({
      token,
    }).lean<InvitationRecord>();
    return doc ? this.toDomain(doc) : null;
  }

  async findById(id: string): Promise<Invitation | null> {
    const doc = await InvitationModel.findById(id).lean<InvitationRecord>();
    return doc ? this.toDomain(doc) : null;
  }

  async update(
    id: string,
    update: Partial<Invitation>,
  ): Promise<Invitation | null> {
    const updated = await InvitationModel.findByIdAndUpdate(id, update, {
      new: true,
    }).lean<InvitationRecord>();
    return updated ? this.toDomain(updated) : null;
  }
}
