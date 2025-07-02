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
  async getProducts(@Req() req): Promise<ProductListDto[]> {
    const user = req.user;
    if (!user || !user.accountId) {
      throw new Error('accountId not found in token');
    }
    return this.productsService.getProductsByAccountId(user.accountId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getProductById(@Param('id') id: string, @Req() req): Promise<ProductListDto> {
    const user = req.user;
    if (!user || !user.accountId) {
      throw new Error('accountId not found in token');
    }
    const product = await this.productsService.getProductById(Number(id), user.accountId);
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
