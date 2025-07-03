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
      referenceNumber: p.referenceNumber,
      name: p.name,
      description: p.description,
      price: Number(p.price),
      currency: p.currency,
      createdAt: p.createdAt,
    }));
  }

  async getProductById(id: string, accountId: number): Promise<ProductListDto | null> {
    const product = await this.productsRepository.findOne({ where: { id, accountId } });
    if (!product) return null;
    return {
      id: product.id,
      referenceNumber: product.referenceNumber,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      currency: product.currency,
      createdAt: product.createdAt,
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
      referenceNumber: saved.referenceNumber,
      name: saved.name,
      description: saved.description,
      price: Number(saved.price),
      currency: saved.currency,
      createdAt: saved.createdAt,
    };
  }

  async getPaginatedProductsByAccountId(accountId: number, page: number, pageSize: number, params: { page?: number; pageSize?: number; search?: string; sort?: string; }): Promise<{ data: ProductListDto[]; total: number; }> {
    const currentPage = params.page ?? 1;
    const currentPageSize = params.pageSize ?? 10;
    const search = params.search ?? '';
    const sort = params.sort === 'desc' ? 'DESC' : 'ASC';

    const query = this.productsRepository.createQueryBuilder('product')
      .where('product.accountId = :accountId', { accountId });

    if (search) {
      query.andWhere('product.name ILIKE :search OR product.description ILIKE :search', { search: `%${search}%` });
    }

    query.orderBy('product.referenceNumber', sort)
      .skip((currentPage - 1) * currentPageSize)
      .take(currentPageSize);

    const [products, total] = await query.getManyAndCount();
    return {
      data: products.map(p => ({
        id: p.id,
        referenceNumber: p.referenceNumber,
        name: p.name,
        description: p.description,
        price: Number(p.price),
        currency: p.currency,
        createdAt: p.createdAt,
      })),
      total,
    };
  }
}
