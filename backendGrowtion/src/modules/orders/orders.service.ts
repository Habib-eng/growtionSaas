import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async getOrdersByAccountId(accountId: number): Promise<Order[]> {
    return this.ordersRepository.find({ where: { accountId }, relations: ['contact'] });
  }
}
