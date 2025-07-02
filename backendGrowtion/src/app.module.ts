import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller'; // ✅ Add this import
import { AppService } from './app.service';       // ✅ And this one too
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { OrdersModule } from './modules/orders/orders.module';
import { AccountsModule } from './modules/accounts/accounts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: +config.get('DB_PORT'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASS'),
        database: config.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // ❗️ Good for dev, turn off in prod
      }),
    }),
    UsersModule,
    AuthModule,
    ContactsModule,
    OrdersModule,
    AccountsModule,
    // other modules here
  ],
  controllers: [AppController],  // ✅ Register the controller
  providers: [AppService],       // ✅ Register the service
})
export class AppModule {}
