import { Body, Controller, Param, Post } from '@nestjs/common'
import { PaymentService } from './payment.service'

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('create/:orderId')
  async createPayment(@Param('orderId') orderId: number) {
    const paymentResult = await this.paymentService.createPayment(orderId)

    await this.paymentService.handleCallback(orderId)

    return paymentResult
  }

  @Post('callback')
  handleCallback(@Body() body) {
    return this.paymentService.handleCallback(body)
  }

  @Post('order-status/:orderId')
  orderStatus(@Param('orderId') orderId: number) {
    console.log(orderId)

    return this.paymentService.orderStatus(orderId)
  }
}
