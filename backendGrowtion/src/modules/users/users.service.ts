import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Account } from '../accounts/account.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
  ) {}

  async checkTable(): Promise<void> {
    // Look for a test user with a unique email
    const testUserEmail = 'test@example.com';

    const existing = await this.usersRepository.findOne({
      where: { email: testUserEmail },
    });

    if (!existing) {
      const user = this.usersRepository.create({
        name: 'Test User',
        email: testUserEmail,
      });
      await this.usersRepository.save(user);
    }
  }

  async createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<User> {
    const existing = await this.usersRepository.findOneBy({ email });
    if (existing) {
      throw new Error('User already exists');
    }

    // Create a new account for the user
    const account = this.accountsRepository.create({ name: 'myStore' });
    await this.accountsRepository.save(account);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
      accountId: account.id,
    });

    return this.usersRepository.save(user);
  }
  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOneBy({ email });
    return user === null ? undefined : user;
  }
  async savePasswordResetToken(userId: number, token: string, expires: Date) {
    await this.usersRepository.update(userId, {
      resetToken: token,
      resetTokenExpires: expires,
    });
  }
  async findByResetToken(token: string) {
    return this.usersRepository.findOne({ where: { resetToken: token } });
  }
}
