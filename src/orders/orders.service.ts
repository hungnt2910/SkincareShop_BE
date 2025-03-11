import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { OrderDetail, Orders, SkincareProduct, SkincareProductDetails, User } from 'src/typeorm/entities'
import { Repository } from 'typeorm'
import { OrderItemDto, ReadyToCheckoutDto, ReturnOrderDetailDto } from './dto/order-items-dto'
import { log } from 'console'

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private readonly orderRepository: Repository<Orders>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(SkincareProduct)
    private readonly skincareProductRepository: Repository<SkincareProduct>
  ) {}

  async getAllOrderByUser(userId: number) {
    return await this.orderRepository.find({ where: { customer: { id: userId } }, relations: ['orderDetails'] })
  }

  async readyToCheckout(readyToCheckoutDto: ReadyToCheckoutDto) {
    const user = await this.userRepository.findOne({ where: { id: readyToCheckoutDto.user_id } })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    const order = new Orders()
    order.customer = user
    order.amount = readyToCheckoutDto.total_amount
    order.status = 'pending'
    order.shippingAddress = readyToCheckoutDto.shippingAddress

    const savedOrder = await this.orderRepository.save(order)

    const orderDetails: OrderDetail[] = []

    for (const orderItem of readyToCheckoutDto.orderItems) {
      const product = await this.skincareProductRepository.findOne({ where: { productId: orderItem.product_id } })
      if (!product) {
        throw new NotFoundException(`Product with ID ${orderItem.product_id} not found`)
      }

      const orderDetail = new OrderDetail()
      orderDetail.order = savedOrder
      orderDetail.product = product
      orderDetail.quantity = orderItem.quantity
      orderDetail.price = orderItem.price

      orderDetails.push(orderDetail)
    }

    await this.orderDetailRepository.save(orderDetails)

    return {
      message: 'Order is ready for checkout',
      name: user.username,
      email: user.email,
      shippingAddress: savedOrder.shippingAddress,
      total_amount: savedOrder.amount,
      orderId: savedOrder.orderId,
      orderDetails: orderDetails.map((detail) => ({
        product_id: detail.product.productId,
        quantity: detail.quantity,
        price: detail.price
      }))
    }
  }

  async ReturnOrderDetail(returnOrderDetailDto: ReturnOrderDetailDto) {}
}
