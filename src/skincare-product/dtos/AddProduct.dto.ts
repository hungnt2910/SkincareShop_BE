import { IsString, IsNumber, IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProductWithDetailsDto {
  // 🔹 Product fields
  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsNumber()
  @IsNotEmpty()
  categoryId: number;

  @IsNumber()
  @IsNotEmpty()
  brandId: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsOptional()
  urlImage?: string;

  // 🔹 Warehouse fields
  @IsDateString()
  @IsNotEmpty()
  productionDate: Date;

  @IsDateString()
  @IsNotEmpty()
  expirationDate: Date;

  @IsNumber()
  @IsNotEmpty()
  quantity: number; // 🔹 Quantity will be added to stock
}
