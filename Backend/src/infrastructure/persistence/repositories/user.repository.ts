import { User } from '../../../domain/models/user.model';
import { UserModel } from '../models/user.schema';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return (await UserModel.findOne({ email }).lean()) as User | null;
  }

  async findById(id: string): Promise<User | null> {
    return (await UserModel.findById(id).lean()) as User | null;
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    const created = await UserModel.create(user);
    return { id: created.id, ...created.toObject() } as unknown as User;
  }

  async update(id: string, update: Partial<User>): Promise<User | null> {
    const updated = await UserModel.findByIdAndUpdate(id, update, {
      new: true,
    }).lean();
    return updated as User | null;
  }
}
