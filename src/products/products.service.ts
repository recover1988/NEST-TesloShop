import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { validate as isUUID } from 'uuid';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }

  async create(createProductDto: CreateProductDto) {

    try {
      // crear el producto(3 formas), no lo graba en la base de datos
      const product = this.productRepository.create(createProductDto);
      // guardar en base de datos
      await this.productRepository.save(product);

      return product;

    } catch (error) {

      this.handleDBException(error);

    }

  }
  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
    });
    return products;
  }

  async findOne(term: string) {
    let product: Product;
    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      product = await this.productRepository.findOneBy({ slug: term });
    }

    if (!product) {
      throw new NotFoundException(`Product with ${term} not found`);
    }

    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return;
  }


  private handleDBException(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);
    // console.log(error)
    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
