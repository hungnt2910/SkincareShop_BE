import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { OrderDetail, Orders, SkincareProduct } from 'src/typeorm/entities'
import { Repository } from 'typeorm'

@Injectable()
export class OrdersMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(Orders)
    private readonly orderRepository: Repository<Orders>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(SkincareProduct)
    private readonly skincareProductRepository: Repository<SkincareProduct>
  ) {}

  async use(req: any, res: any, next: () => void) {
    try {
      const { orderId } = req.params // Extract from params for confirmation
      const errors: {
        name: string
        success: boolean
        message: string
        status: number
      }[] = []

      // Check if order ID exists in the request
      if (!orderId) {
        errors.push({
          name: 'order_id',
          success: false,
          message: 'Order ID is required',
          status: 400
        })
      }

      // Find the order in the database
      const order = await this.orderRepository.findOne({ where: { orderId } })
      if (!order) {
        errors.push({
          name: 'order_id',
          success: false,
          message: 'Order not found',
          status: 404
        })
      } else if (order.status === 'confirmed') {
        errors.push({
          name: 'order_id',
          success: false,
          message: 'Order is already confirmed',
          status: 400
        })
      }

      // Check stock for order items if order exists
      if (order) {
        const orderDetails = await this.orderDetailRepository.find({
          where: { order: { orderId } },
          relations: ['product']
        })

        const outOfStockItems = orderDetails.filter((detail) => detail.product.stock <= 0)

        if (outOfStockItems.length > 0) {
          errors.push({
            name: 'order_id',
            success: false,
            message: `Order cannot be confirmed, ${outOfStockItems.length} product(s) are out of stock`,
            status: 400
          })
        }
      }

      // If there are any errors, return them as a response
      if (errors.length > 0) {
        return res.status(400).json({ errors })
      }

      next()
    } catch (error) {
      console.error('Error in OrdersMiddleware:', error)
      throw new BadRequestException('An error occurred while processing the order confirmation')
    }
  }
}
