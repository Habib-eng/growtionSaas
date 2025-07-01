import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }
  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOneBy({ email });
    return user === null ? undefined : user;
  }
}
