import { Transform, Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsOptional, Max, MaxDate, Min } from 'class-validator'

export class createVoucherDto {
  @IsNotEmpty()
  @Transform(({ value }) => value?.toUpperCase())
  code: string

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(70)
  discount: number

  @IsNotEmpty()
  @MaxDate(new Date(), { message: 'Expiration date cannot be in the future' })
  expirationDate: Date
}

export class updateVoucherDto {
  @IsOptional()
  @IsNumber()
  discount?: number

  @IsOptional()
  @MaxDate(new Date(), { message: 'Expiration date cannot be in the future' })
  expirationDate: Date
}

export class claimVoucherDto {
  @IsNotEmpty()
  voucherId: number

  @IsNotEmpty()
  userId: number
}

export class applyVoucherDto {
  @IsNotEmpty()
  userId: number

  @IsNotEmpty()
  voucherCode: string
}