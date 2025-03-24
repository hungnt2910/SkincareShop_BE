import { IsArray, IsNotEmpty, IsNumber, IsPositive, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class OrderItemDto {
  @IsNumber()
  @IsNotEmpty()
  product_id: number

  @IsNumber()
  @IsPositive()
  quantity: number

  @IsNumber()
  @IsPositive()
  price: number
}

export class ReadyToCheckoutDto {
  @IsNumber()
  @IsNotEmpty()
  user_id: number

  @IsNumber()
  @IsPositive()
  total_amount: number

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[]

  @IsNotEmpty()
  shippingAddress: string

  @IsNotEmpty()
  receiverName: string

  @IsNotEmpty()
  phoneNumber: string
}

export class ReturnOrderDetailDto {
  @IsNumber()
  @IsNotEmpty()
  user_id: number

  @IsNumber()
  @IsNotEmpty()
  order_id: number

  @IsNumber()
  @IsPositive()
  total_amount: number

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[]

  @IsNotEmpty()
  shippingAddress: string

  @IsNotEmpty()
  reason: string
}

export class callbackReturnDto {
  @IsNumber()
  @IsNotEmpty()
  order_id: number
}
