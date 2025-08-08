import { User } from '../../../domain/models/user.model';
import { UserModel } from '../models/user.schema';

type UserRecord = Omit<User, 'id'> & { _id: unknown };

export class UserRepository {
  private toDomain(doc: UserRecord): User {
    const { _id, ...user } = doc;
    return { id: String(_id), ...user } as User;
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email }).lean<UserRecord>();
    return doc ? this.toDomain(doc) : null;
  }

  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id).lean<UserRecord>();
    return doc ? this.toDomain(doc) : null;
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    const created = await UserModel.create(user);
    return this.toDomain(created.toObject() as UserRecord);
  }

  async update(id: string, update: Partial<User>): Promise<User | null> {
    const updated = await UserModel.findByIdAndUpdate(id, update, {
      new: true,
    }).lean<UserRecord>();
    return updated ? this.toDomain(updated) : null;
  }
}
