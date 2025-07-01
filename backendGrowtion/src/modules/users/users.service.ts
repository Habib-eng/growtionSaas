import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

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
}
