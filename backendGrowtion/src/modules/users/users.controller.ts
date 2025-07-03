import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('check-table')
  async checkTable(): Promise<string> {
    await this.usersService.checkTable();
    return 'Users table exists (or was checked)';
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(
    @Req() req: Request,
    @Body() body: { firstName: string; lastName: string; country: string; phone: string }
  ) {
    console.log('DEBUG req.user:', req.user);
    const userId = (req.user as any)?.userId;
    if (!userId) throw new Error('User not found in token');
    const name = `${body.firstName} ${body.lastName}`.trim();
    return this.usersService.updateUserProfile(userId, { name, country: body.country, phone: body.phone });
  }
}
