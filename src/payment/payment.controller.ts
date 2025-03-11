import { Body, Controller, Param, Post } from '@nestjs/common'
import { PaymentService } from './payment.service'

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('create/:orderId')
  createPayment(@Param('orderId') orderId: number) {
    console.log(typeof orderId)

    return this.paymentService.createPayment(orderId)
  }

  @Post('callback')
  handleCallback(@Body() dataStr: string, reqMac: string) {
    console.log(dataStr, reqMac)

    return this.paymentService.handleCallback(dataStr, reqMac)
  }

  @Post('order-status/:orderId')
  orderStatus(@Param('orderId') orderId: number) {
    console.log(orderId)

    return this.paymentService.orderStatus(orderId)
  }
}
