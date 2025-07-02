import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getOrders(@Req() req) {
    // req.user is set by JwtStrategy.validate
    // You may need to fetch the user from DB to get accountId
    const user = req.user;
    if (!user || !user.userId) {
      throw new Error('User not found in request');
    }
    // You may want to inject UsersService to fetch the user and get accountId
    // For now, assume JWT payload includes accountId
    const accountId = user.accountId;
    if (!accountId) {
      throw new Error('accountId not found in token');
    }
    return this.ordersService.getOrdersByAccountId(accountId);
  }
}
