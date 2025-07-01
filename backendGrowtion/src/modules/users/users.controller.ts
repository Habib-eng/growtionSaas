import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('check-table')
  async checkTable(): Promise<string> {
    await this.usersService.checkTable();
    return 'Users table exists (or was checked)';
  }
}
