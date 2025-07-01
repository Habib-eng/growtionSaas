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
import { SignInDto, SignUpDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('signin')
  async login(@Body() body: SignInDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      return { statusCode: 401, message: 'Invalid credentials' };
    }
    return this.authService.login(user);
  }

  @Post('signup')
  async signup(@Body() body: SignUpDto) {
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
  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    try {
      const user = await this.usersService.findByEmail(body.email);
      if (!user) {
        throw new BadRequestException('Email not found');
      }

      // Generate a reset token
      const token = await this.authService.generatePasswordResetToken(user);

      // Send the token via email
      await this.authService.sendPasswordResetEmail(user.email, token);

      return { message: 'Password reset instructions sent' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('verify-reset-token')
  async verifyResetToken(@Body() body: { token: string }) {
    const user = await this.usersService.findByResetToken(body.token);
    if (!user || user.resetTokenExpires < new Date()) {
      return { valid: false };
    }
    return { valid: true };
  }
}
