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
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}
  @Post('google')
  async googleAuth(@Body() body: { token: string }) {
    const client = new OAuth2Client(this.configService.get('GOOGLE_CLIENT_ID'));
    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: body.token,
        audience: this.configService.get('GOOGLE_CLIENT_ID'),
      });
    } catch (err) {
      throw new BadRequestException('Invalid Google token');
    }
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new BadRequestException('Google account has no email');
    }
    // Try to find user by email
    let user = await this.usersService.findByEmail(payload.email);
    if (!user) {
      // Create user with Google info (fill missing fields as needed)
      user = await this.usersService.createUser(
        payload.name || 'Google User',
        '', // country unknown
        '', // phone unknown
        payload.email,
        '', // no password for Google users
      );
    }
    // Return JWT or session as for normal login
    return this.authService.login(user);
  }

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
      // Accept name, country, phone, email, password
      const user = await this.usersService.createUser(
        body.name,
        body.country,
        body.phone,
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
