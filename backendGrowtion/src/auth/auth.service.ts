import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/modules/users/users.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // Remove password before returning user
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, accountId: user.accountId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
   async generatePasswordResetToken(user) {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // 1 hour expiry

    // Save token & expiry on the user, or a separate table
    await this.usersService.savePasswordResetToken(user.id, token, expires);

    return token;
  }

  async sendPasswordResetEmail(email: string, token: string) {
    // should be fixed
    const resetLink = `https://yourapp.com/reset-password?token=${token}`;
    // Use MailService or Nodemailer here
    console.log(`Send this link to ${email}: ${resetLink}`);
  }
  
}
