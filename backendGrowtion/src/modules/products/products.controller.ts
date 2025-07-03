import { Controller, Get, Req, UseGuards, Param, Body, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProductListDto } from './dto/product-list.dto';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProducts(@Req() req): Promise<{ data: ProductListDto[]; total: number; page: number; pageSize: number; }> {
    const user = req.user;
    if (!user || !user.accountId) {
      throw new Error('accountId not found in token');
    }
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const { data: products, total } = await this.productsService.getPaginatedProductsByAccountId(
      user.accountId,
      page,
      pageSize,
      {
        page,
        pageSize,
        search: req.query.search || '',
        sort: req.query.sort || 'asc',
      }
    );
    return {
      data: products,
      total,
      page,
      pageSize,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getProductById(@Param('id') id: string, @Req() req): Promise<ProductListDto> {
    const user = req.user;
    if (!user || !user.accountId) {
      throw new Error('accountId not found in token');
    }
    const product = await this.productsService.getProductById(id, user.accountId);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createProduct(@Body() dto: CreateProductDto, @Req() req): Promise<ProductListDto> {
    const user = req.user;
    if (!user || !user.accountId) {
      throw new Error('accountId not found in token');
    }
    return this.productsService.createProduct(dto, user.accountId);
  }
}
