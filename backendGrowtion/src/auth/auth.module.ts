import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/modules/users/users.module';
import { UsersService } from 'src/modules/users/users.service';
import { AccountsModule } from 'src/modules/accounts/accounts.module';

@Module({
  imports: [
    UsersModule,
    AccountsModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '3600s' },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, UsersService],
  controllers: [AuthController],
})
export class AuthModule {}
