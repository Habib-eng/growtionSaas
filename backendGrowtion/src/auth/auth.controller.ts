import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/modules/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('signin')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      return { statusCode: 401, message: 'Invalid credentials' };
    }
    return this.authService.login(user);
  }

  @Post('signup')
  async signup(
    @Body() body: { name: string; email: string; password: string },
  ) {
    try {
      const user = await this.usersService.createUser(
        body.name,
        body.email,
        body.password,
      );
      // Don't return password
      const { password, ...result } = user;
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
