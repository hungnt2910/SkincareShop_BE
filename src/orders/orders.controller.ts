import { Controller, Get, Param, UseGuards, Post, Body, Put } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { AuthGuard } from 'src/guards/auth.guard'

@UseGuards(AuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private orderService: OrdersService) {}

  @Get()
  getAllOrder() {
    return this.orderService.getAllOrder()
  }

  @Get(':userId')
  getUserOrderHistory(@Param('userId') userId: number) {
    return this.orderService.getAllOrderByUser(userId)
  }

  @Post('checkout')
  readyToCheckout(@Body() readyToCheckoutDto) {
    return this.orderService.readyToCheckout(readyToCheckoutDto)
  }

  @Post('return')
  readyReturnOrderDetail(@Body() returnOrderDetailDto) {
    return this.orderService.readyReturnOrderDetail(returnOrderDetailDto)
  }

  @Put('confirm/:orderId')
  confirmOrder(@Param('orderId') orderId: number) {
    return this.orderService.confirmOrder(orderId)
  }

  @Put('deliver/:orderId')
  deliverOrder(@Param('orderId') orderId: number) {
    return this.orderService.deliverOrder(orderId)
  }

  @Put('refund/:orderId')
  refundOrder(@Param('orderId') orderId: number) {
    return this.orderService.refundOrder(orderId)
  }
}
