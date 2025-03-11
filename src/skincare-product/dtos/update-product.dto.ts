import { PartialType } from '@nestjs/mapped-types';
import { CreateProductWithDetailsDto } from './AddProduct.dto';

export class UpdateProductDto extends PartialType(CreateProductWithDetailsDto) {}
