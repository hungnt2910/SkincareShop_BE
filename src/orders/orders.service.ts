import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  OrderDetail,
  Orders,
  ReturnOrderDetail,
  SkincareProduct,
  SkincareProductDetails,
  User
} from 'src/typeorm/entities'
import { MoreThan, Or, Repository } from 'typeorm'
import { OrderItemDto, ReadyToCheckoutDto, ReturnOrderDetailDto, callbackReturnDto } from './dto/order-items-dto'
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
    private readonly skincareProductRepository: Repository<SkincareProduct>,
    @InjectRepository(ReturnOrderDetail)
    private readonly returnOrderDetailRepository: Repository<ReturnOrderDetail>,
    @InjectRepository(SkincareProductDetails)
    private readonly skincareProductDetailsRepository: Repository<SkincareProductDetails>
  ) {}

  async getAllOrder() {
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderDetails', 'orderDetail')
      .leftJoinAndSelect('orderDetail.product', 'product')
      .leftJoinAndSelect('order.customer', 'user')
      .select([
        'user.username AS username',
        'order.orderId AS orderId',
        'order.status AS status',
        'order.amount AS amount',
        'order.shippingAddress AS shippingAddress',
        'order.timestamp AS timestamp',
        'order.receiverName AS receiverName',
        'order.phoneNumber AS phoneNumber',
        'orderDetail.orderDetailId AS orderDetailId',
        'orderDetail.price AS price',
        'orderDetail.quantity AS quantity',
        'product.productName AS productName'
      ])
      .getRawMany()

    // Transforming the flat data into a structured JSON format
    const groupedOrders = orders.reduce((acc, row) => {
      let order = acc.find((o) => o.orderId === row.orderId)
      if (!order) {
        order = {
          orderId: row.orderId,
          username: row.username,
          status: row.status,
          amount: row.amount,
          receiverName: row.receiverName,
          phoneNumber: row.phoneNumber,
          shippingAddress: row.shippingAddress,
          timestamp: row.timestamp,
          orderDetails: []
        }
        acc.push(order)
      }

      // Adding orderDetails
      order.orderDetails.push({
        orderDetailId: row.orderDetailId,
        price: row.price,
        quantity: row.quantity,
        productName: row.productName
      })

      return acc
    }, [])

    return groupedOrders
  }

  async getAllOrderByUser(userId: number) {
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderDetails', 'orderDetail')
      .leftJoinAndSelect('orderDetail.product', 'product')
      .where('order.customer = :userId', { userId })
      .select([
        'order.orderId AS orderId',
        'order.status AS status',
        'order.amount AS amount',
        'order.shippingAddress AS shippingAddress',
        'order.timestamp AS timestamp',
        'order.receiverName AS receiverName',
        'order.phoneNumber AS phoneNumber',
        'orderDetail.orderDetailId AS orderDetailId',
        'orderDetail.price AS price',
        'orderDetail.quantity AS quantity',
        'product.productName AS productName'
      ])
      .getRawMany()

    // Transforming the flat data into a structured JSON format
    const groupedOrders = orders.reduce((acc, row) => {
      let order = acc.find((o) => o.orderId === row.orderId)
      if (!order) {
        order = {
          orderId: row.orderId,
          status: row.status,
          amount: row.amount,
          receiverName: row.receiverName,
          phoneNumber: row.phoneNumber,
          shippingAddress: row.shippingAddress,
          timestamp: row.timestamp,
          orderDetails: []
        }
        acc.push(order)
      }

      // Adding orderDetails
      order.orderDetails.push({
        orderDetailId: row.orderDetailId,
        price: row.price,
        quantity: row.quantity,
        productName: row.productName
      })

      return acc
    }, [])

    return groupedOrders
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
    order.receiverName = readyToCheckoutDto.receiverName
    order.phoneNumber = readyToCheckoutDto.phoneNumber

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
      receiverName: savedOrder.receiverName,
      phoneNumber: savedOrder.phoneNumber,
      orderId: savedOrder.orderId,
      reason: savedOrder.reason,
      orderDetails: orderDetails.map((detail) => ({
        product_id: detail.product.productId,
        quantity: detail.quantity,
        price: detail.price
      }))
    }
  }

  async readyReturnOrderDetail(returnOrderDetailDto: ReturnOrderDetailDto) {
    console.log(returnOrderDetailDto.order_id)

    const user = await this.userRepository.findOne({ where: { id: returnOrderDetailDto.user_id } })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    const returningOrderInfo = await this.orderRepository.findOne({ where: { orderId: returnOrderDetailDto.order_id } })
    if (!returningOrderInfo) {
      throw new NotFoundException('Order not found')
    }
    if (returningOrderInfo.status === 'paid') {
      throw new BadRequestException('Order is already returned')
    }

    const returnOrder = new Orders()
    returnOrder.customer = user
    returnOrder.amount = returnOrderDetailDto.total_amount
    returnOrder.status = 'returned'
    returnOrder.shippingAddress = returnOrderDetailDto.shippingAddress
    returnOrder.receiverName = returningOrderInfo.receiverName
    returnOrder.phoneNumber = returningOrderInfo.phoneNumber
    returnOrder.reason = returnOrderDetailDto.reason

    const savedReturnOrder = await this.orderRepository.save(returnOrder)

    const returnOrderDetails: ReturnOrderDetail[] = []

    for (const orderItem of returnOrderDetailDto.orderItems) {
      const product = await this.skincareProductRepository.findOne({ where: { productId: orderItem.product_id } })
      if (!product) {
        throw new NotFoundException(`Product with ID ${orderItem.product_id} not found`)
      }

      const returnOrderDetail = new ReturnOrderDetail()
      returnOrderDetail.order = savedReturnOrder
      returnOrderDetail.product = product
      returnOrderDetail.quantity = orderItem.quantity
      returnOrderDetail.price = orderItem.price

      returnOrderDetails.push(returnOrderDetail)
    }

    await this.returnOrderDetailRepository.save(returnOrderDetails)
    await this.orderRepository.update({ orderId: returnOrderDetailDto.order_id }, { status: 'paid' })

    return {
      message: 'Order is being returned',
      name: user.username,
      email: user.email,
      receiverName: savedReturnOrder.receiverName,
      phoneNumber: savedReturnOrder.phoneNumber,
      shippingAddress: savedReturnOrder.shippingAddress,
      total_amount: savedReturnOrder.amount,
      orderId: savedReturnOrder.orderId,
      reason: savedReturnOrder.reason,
      orderDetails: returnOrderDetails.map((detail) => ({
        product_id: detail.product.productId,
        quantity: detail.quantity,
        price: detail.price
      }))
    }
  }

  async confirmOrder(orderId: number) {
    const order = await this.orderRepository.findOne({ where: { orderId } })
    if (!order) {
      throw new NotFoundException('Order not found')
    }
    if (order.status === 'confirmed') {
      throw new BadRequestException('Order is already confirmed')
    }
    if (order.status === 'delivered') {
      throw new BadRequestException('Order is already delivered')
    }

    await this.orderRepository.update({ orderId }, { status: 'confirmed' })

    const currentStatus = await this.orderRepository.findOne({ where: { orderId } })

    return {
      message: `Order ${order.orderId} confirmed`,
      orderId
    }
  }

  async deliverOrder(orderId: number) {
    if (!orderId) {
      throw new BadRequestException('Order ID is required')
    }

    const order = await this.orderRepository.findOne({ where: { orderId } })
    if (!order) {
      throw new NotFoundException('Order not found')
    } else if (order.status === 'delivered') {
      throw new BadRequestException('Order is already delivered')
    }

    await this.orderRepository.update({ orderId }, { status: 'delivered' })

    return {
      message: 'Order is delivered',
      orderId
    }
  }

  async confirmReturnOrder(orderId: number) {
    const order = await this.orderRepository.findOne({ where: { orderId } })
    if (!order) {
      throw new NotFoundException('Order not found')
    }

    if (order.status !== 'returned') {
      throw new BadRequestException('Order is not returned to be ready to refund')
    }

    await this.orderRepository.update({ orderId }, { status: 'ready to refund' })

    return {
      message: 'Order is returned',
      orderId
    }
  }

  async refundOrder(orderId: number) {
    if (!orderId) {
      throw new BadRequestException('Order ID is required')
    }

    const order = await this.orderRepository.findOne({ where: { orderId } })
    if (!order) {
      throw new NotFoundException('Order not found')
    } else if (order.status === 'refunded') {
      throw new BadRequestException('Order is already refunded')
    } else if (order.status !== 'ready to refund') {
      throw new BadRequestException('Order is not ready to be refunded')
    }

    // Update order status to 'refunded'
    await this.orderRepository.update({ orderId }, { status: 'refunded' })

    // Get order items and related product details
    const orderItems = await this.returnOrderDetailRepository.find({
      where: { order: { orderId } },
      relations: ['product']
    })

    for (const item of orderItems) {
      let remainingQuantity = item.quantity

      // Get product details ordered by expiration date
      const productDetails = await this.skincareProductDetailsRepository.find({
        where: {
          product: { productId: item.product.productId },
          expirationDate: MoreThan(new Date()) // Only consider non-expired products
        },
        order: { expirationDate: 'ASC' }
      })

      for (const detail of productDetails) {
        if (remainingQuantity <= 0) break

        const updateQuantity = Math.min(detail.quantity, remainingQuantity)

        // Update product details quantity (add back the refunded quantity)
        await this.skincareProductDetailsRepository.update(
          { productDetailsId: detail.productDetailsId },
          { quantity: detail.quantity + updateQuantity }
        )

        remainingQuantity -= updateQuantity
      }

      // If there's still remaining quantity, add it to the overall stock
      if (remainingQuantity > 0) {
        await this.skincareProductDetailsRepository.increment(
          { product: { productId: item.product.productId } },
          'quantity',
          remainingQuantity
        )
      }

      // Update product stock in main table
      await this.skincareProductRepository.update(
        { productId: item.product.productId },
        { stock: item.product.stock + item.quantity }
      )
    }

    return {
      message: `Order is refunded.`,
      orderId
    }
  }

  async getRefundedOrderByUser(userId: number) {
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.returnDetails', 'returnDetail')
      .leftJoinAndSelect('returnDetail.product', 'product')
      .where('order.customer = :userId', { userId })
      .andWhere('order.status = :status', { status: 'refunded' })
      .select([
        'order.orderId AS orderId',
        'order.status AS status',
        'order.amount AS amount',
        'order.shippingAddress AS shippingAddress',
        'order.timestamp AS timestamp',
        'order.receiverName AS receiverName',
        'order.phoneNumber AS phoneNumber',
        'order.reason AS reason',
        'returnDetail.returnOrderDetailId AS returnOrderDetailId',
        'returnDetail.price AS price',
        'returnDetail.quantity AS quantity',
        'product.productName AS productName'
      ])
      .getRawMany()

    if (!orders.length) {
      throw new NotFoundException(`No refunded orders found for user with ID ${userId}`)
    }

    const groupedOrders = orders.reduce((acc, row) => {
      let order = acc.find((o) => o.orderId === row.orderId)
      if (!order) {
        order = {
          orderId: row.orderId,
          status: row.status,
          amount: row.amount,
          receiverName: row.receiverName,
          phoneNumber: row.phoneNumber,
          shippingAddress: row.shippingAddress,
          reason: row.reason,
          timestamp: row.timestamp,
          returnDetails: []
        }
        acc.push(order)
      }

      // Adding order details
      order.returnDetails.push({
        returnOrderDetailId: row.returnOrderDetailId,
        price: row.price,
        quantity: row.quantity,
        productName: row.productName
      })

      return acc
    }, [])

    return groupedOrders
  }

  async getReturnedOrderByUser(userId: number) {
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.returnDetails', 'returnDetail')
      .leftJoinAndSelect('returnDetail.product', 'product')
      .where('order.customer = :userId', { userId })
      .andWhere('order.status = :status', { status: 'returned' })
      .select([
        'order.orderId AS orderId',
        'order.status AS status',
        'order.amount AS amount',
        'order.shippingAddress AS shippingAddress',
        'order.timestamp AS timestamp',
        'order.receiverName AS receiverName',
        'order.phoneNumber AS phoneNumber',
        'order.reason AS reason',
        'returnDetail.returnOrderDetailId AS returnOrderDetailId',
        'returnDetail.price AS price',
        'returnDetail.quantity AS quantity',
        'product.productName AS productName'
      ])
      .getRawMany()

    if (!orders.length) {
      throw new NotFoundException(`No returned orders found for user with ID ${userId}`)
    }

    const groupedOrders = orders.reduce((acc, row) => {
      let order = acc.find((o) => o.orderId === row.orderId)
      if (!order) {
        order = {
          orderId: row.orderId,
          status: row.status,
          amount: row.amount,
          receiverName: row.receiverName,
          phoneNumber: row.phoneNumber,
          shippingAddress: row.shippingAddress,
          reason: row.reason,
          timestamp: row.timestamp,
          returnDetails: []
        }
        acc.push(order)
      }

      // Adding order details
      order.returnDetails.push({
        returnOrderDetailId: row.returnOrderDetailId,
        price: row.price,
        quantity: row.quantity,
        productName: row.productName
      })

      return acc
    }, [])

    return groupedOrders
  }

  async getDeliveredOrderByUser(userId: number) {
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderDetails', 'orderDetail')
      .leftJoinAndSelect('orderDetail.product', 'product')
      .where('order.customer = :userId', { userId })
      .andWhere('order.status = :status', { status: 'delivered' })
      .select([
        'order.orderId AS orderId',
        'order.status AS status',
        'order.amount AS amount',
        'order.shippingAddress AS shippingAddress',
        'order.timestamp AS timestamp',
        'order.receiverName AS receiverName',
        'order.phoneNumber AS phoneNumber',
        'orderDetail.orderDetailId AS orderDetailId',
        'orderDetail.price AS price',
        'orderDetail.quantity AS quantity',
        'product.productId AS productId',
        'product.productName AS productName'
      ])
      .getRawMany()

    if (!orders.length) {
      throw new NotFoundException(`No delivered orders found for user with ID ${userId}`)
    }

    const groupedOrders = orders.reduce((acc, row) => {
      let order = acc.find((o) => o.orderId === row.orderId)
      if (!order) {
        order = {
          orderId: row.orderId,
          status: row.status,
          amount: row.amount,
          receiverName: row.receiverName,
          phoneNumber: row.phoneNumber,
          shippingAddress: row.shippingAddress,
          timestamp: row.timestamp,
          orderDetails: []
        }
        acc.push(order)
      }

      // Adding order details
      order.orderDetails.push({
        orderDetailId: row.orderDetailId,
        productId: row.productId,
        price: row.price,
        quantity: row.quantity,
        productName: row.productName
      })

      return acc
    }, [])

    return groupedOrders
  }

  async getConfirmedOrderByUser(userId: number) {
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderDetails', 'orderDetail')
      .leftJoinAndSelect('orderDetail.product', 'product')
      .where('order.customer = :userId', { userId })
      .andWhere('order.status = :status', { status: 'confirmed' })
      .select([
        'order.orderId AS orderId',
        'order.status AS status',
        'order.amount AS amount',
        'order.shippingAddress AS shippingAddress',
        'order.timestamp AS timestamp',
        'order.receiverName AS receiverName',
        'order.phoneNumber AS phoneNumber',
        'orderDetail.orderDetailId AS orderDetailId',
        'orderDetail.price AS price',
        'orderDetail.quantity AS quantity',
        'product.productName AS productName'
      ])
      .getRawMany()

    if (!orders.length) {
      throw new NotFoundException(`No confirmed orders found for user with ID ${userId}`)
    }

    const groupedOrders = orders.reduce((acc, row) => {
      let order = acc.find((o) => o.orderId === row.orderId)
      if (!order) {
        order = {
          orderId: row.orderId,
          status: row.status,
          amount: row.amount,
          receiverName: row.receiverName,
          phoneNumber: row.phoneNumber,
          shippingAddress: row.shippingAddress,
          timestamp: row.timestamp,
          orderDetails: []
        }
        acc.push(order)
      }

      // Adding order details
      order.orderDetails.push({
        orderDetailId: row.orderDetailId,
        price: row.price,
        quantity: row.quantity,
        productName: row.productName
      })

      return acc
    }, [])

    return groupedOrders
  }

  async getPendingOrderByUser(userId: number) {
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderDetails', 'orderDetail')
      .leftJoinAndSelect('orderDetail.product', 'product')
      .where('order.customer = :userId', { userId })
      .andWhere('order.status = :status', { status: 'pending' })
      .select([
        'order.orderId AS orderId',
        'order.status AS status',
        'order.amount AS amount',
        'order.shippingAddress AS shippingAddress',
        'order.timestamp AS timestamp',
        'order.receiverName AS receiverName',
        'order.phoneNumber AS phoneNumber',
        'orderDetail.orderDetailId AS orderDetailId',
        'orderDetail.price AS price',
        'orderDetail.quantity AS quantity',
        'product.productName AS productName'
      ])
      .getRawMany()

    if (!orders.length) {
      throw new NotFoundException(`No pending orders found for user with ID ${userId}`)
    }

    const groupedOrders = orders.reduce((acc, row) => {
      let order = acc.find((o) => o.orderId === row.orderId)
      if (!order) {
        order = {
          orderId: row.orderId,
          status: row.status,
          amount: row.amount,
          receiverName: row.receiverName,
          phoneNumber: row.phoneNumber,
          shippingAddress: row.shippingAddress,
          timestamp: row.timestamp,
          orderDetails: []
        }
        acc.push(order)
      }

      // Adding order details
      order.orderDetails.push({
        orderDetailId: row.orderDetailId,
        price: row.price,
        quantity: row.quantity,
        productName: row.productName
      })

      return acc
    }, [])

    return groupedOrders
  }

  async getPaidOrderByUser(userId: number) {
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderDetails', 'orderDetail')
      .leftJoinAndSelect('orderDetail.product', 'product')
      .where('order.customer = :userId', { userId })
      .andWhere('order.status = :status', { status: 'paid' })
      .select([
        'order.orderId AS orderId',
        'order.status AS status',
        'order.amount AS amount',
        'order.shippingAddress AS shippingAddress',
        'order.timestamp AS timestamp',
        'order.receiverName AS receiverName',
        'order.phoneNumber AS phoneNumber',
        'orderDetail.orderDetailId AS orderDetailId',
        'orderDetail.price AS price',
        'orderDetail.quantity AS quantity',
        'product.productName AS productName'
      ])
      .getRawMany()

    if (!orders.length) {
      throw new NotFoundException(`No paid orders found for user with ID ${userId}`)
    }

    const groupedOrders = orders.reduce((acc, row) => {
      let order = acc.find((o) => o.orderId === row.orderId)
      if (!order) {
        order = {
          orderId: row.orderId,
          status: row.status,
          amount: row.amount,
          receiverName: row.receiverName,
          phoneNumber: row.phoneNumber,
          shippingAddress: row.shippingAddress,
          timestamp: row.timestamp,
          orderDetails: []
        }
        acc.push(order)
      }

      // Adding order details
      order.orderDetails.push({
        orderDetailId: row.orderDetailId,
        price: row.price,
        quantity: row.quantity,
        productName: row.productName
      })

      return acc
    }, [])

    return groupedOrders
  }
}
