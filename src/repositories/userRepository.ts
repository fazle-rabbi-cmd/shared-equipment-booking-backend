import { User } from '../models/User';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } });
  }

  async createUser(userData: {
    name: string;
    email: string;
    passwordHash: string;
    role?: 'EMPLOYEE' | 'ADMIN';
  }): Promise<User> {
    return await User.create(userData);
  }

  async findById(id: number): Promise<User | null> {
    return await User.findByPk(id, {
      attributes: { exclude: ['passwordHash'] },
    });
  }
}