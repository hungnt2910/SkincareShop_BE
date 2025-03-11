import { Controller, Get, Param, UseGuards, Post, Body } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { AuthGuard } from 'src/guards/auth.guard'

@UseGuards(AuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private orderService: OrdersService) {}

  @Get(':userId')
  getUserOrderHistory(@Param('userId') userId: number) {
    return this.orderService.getAllOrderByUser(userId)
  }

  @Post('checkout')
  readyToCheckout(@Body() readyToCheckoutDto) {
    return this.orderService.readyToCheckout(readyToCheckoutDto)
  }
}
