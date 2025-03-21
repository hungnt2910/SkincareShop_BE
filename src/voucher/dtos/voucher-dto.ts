import { Transform, Type } from 'class-transformer'
import { IsDate, IsNotEmpty, IsNumber, IsOptional, Max, MaxDate, Min, MinDate } from 'class-validator'

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
  @Type(() => Date)
  @MinDate(() => new Date(), { message: 'Expiration date cannot be in the past' })
  expirationDate: Date
}

export class updateVoucherDto {
  @IsOptional()
  @IsNumber()
  discount?: number

  @IsOptional()
  @Type(() => Date)
  @MinDate(() => new Date(), { message: 'Expiration date cannot be in the past' })
  expirationDate?: Date
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
