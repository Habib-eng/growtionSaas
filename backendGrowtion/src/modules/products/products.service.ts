import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { ProductListDto } from './dto/product-list.dto';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async getProductsByAccountId(accountId: number): Promise<ProductListDto[]> {
    const products = await this.productsRepository.find({ where: { accountId } });
    return products.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: Number(p.price),
    }));
  }

  async getProductById(id: number, accountId: number): Promise<ProductListDto | null> {
    const product = await this.productsRepository.findOne({ where: { id, accountId } });
    if (!product) return null;
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
    };
  }

  async createProduct(dto: CreateProductDto, accountId: number): Promise<ProductListDto> {
    const product = this.productsRepository.create({
      ...dto,
      accountId,
    });
    const saved = await this.productsRepository.save(product);
    return {
      id: saved.id,
      name: saved.name,
      description: saved.description,
      price: Number(saved.price),
    };
  }
}
