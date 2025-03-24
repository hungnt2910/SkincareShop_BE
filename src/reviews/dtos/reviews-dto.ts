import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsPositive, ValidateNested } from 'class-validator'

export class ReviewByProductIdDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number

  @IsNumber()
  @IsNotEmpty()
  userId: number

  @IsNumber()
  @IsNotEmpty()
  orderId: number

  @IsNumber()
  @IsNotEmpty()
  rating: number

  @IsOptional()
  comment: string
}

export class getReviewsByProductIdDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number
}
