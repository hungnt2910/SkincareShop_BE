import { BadRequestException, Injectable, Body } from '@nestjs/common'
import axios from 'axios'
import * as CryptoJS from 'crypto-js'
import * as moment from 'moment'
import { In, LessThanOrEqual, MoreThan, Repository } from 'typeorm'
import { OrderDetail, Orders, SkincareProduct, SkincareProductDetails, User } from 'src/typeorm/entities'
import { InjectRepository } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class PaymentService {
  private readonly config

  constructor(
    @InjectRepository(Orders)
    private readonly orderRepository: Repository<Orders>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    private readonly configService: ConfigService,
    @InjectRepository(SkincareProduct)
    private readonly skincareProductRepository: Repository<SkincareProduct>,
    @InjectRepository(SkincareProductDetails)
    private readonly skincareProductDetailsRepository: Repository<SkincareProductDetails>
  ) {
    this.config = {
      app_id: this.configService.get<string>('ZALOPAY_APP_ID'),
      key1: this.configService.get<string>('ZALOPAY_KEY1'),
      key2: this.configService.get<string>('ZALOPAY_KEY2'),
      endpoint: this.configService.get<string>('ZALOPAY_CREATE_ENDPOINT'),
      refund_url: this.configService.get<string>('ZALOPAY_REFUND_ENDPOINT')
    }
  }

  async createPayment(orderId: number) {
    const orderResult = await this.orderRepository.findOne({
      where: { orderId },
      relations: ['customer', 'orderDetails']
    })

    if (!orderResult) {
      throw new BadRequestException('Order not found')
    }

    if (!orderResult.customer) {
      throw new BadRequestException('Customer information is missing')
    }

    const itemsResult = await this.orderDetailRepository.find({
      where: { order: { orderId } },
      relations: ['product']
    })

    if (!itemsResult.length) {
      throw new BadRequestException('No items found for this order')
    }

    const items = itemsResult.map((item) => ({
      id: item.product.productId,
      name: item.product.productName,
      price: item.price,
      quantity: item.quantity,
      stock: item.product.stock
    }))

    const transId = orderResult.orderId
    const appTransId = `${moment().format('YYMMDD')}_${transId}`
    const embedData = {
      redirecturl: 'https://docs.zalopay.vn/v1/start/'
    }

    const order = {
      app_id: this.config.app_id,
      app_trans_id: appTransId,
      app_user: orderResult.customer.id,
      app_time: Date.now(),
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embedData),
      amount: orderResult.amount,
      description: `Skincareshop - Payment for the order #${transId}`,
      bank_code: '',
      callback_url: ''
    }

    const data = `${this.config.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`
    order['mac'] = CryptoJS.HmacSHA256(data, this.config.key1).toString()

    try {
      const response = await axios.post(this.config.endpoint, null, { params: order })

      return response.data
    } catch (error) {
      console.error('Payment request failed:', error.response?.data || error.message)
      throw new BadRequestException('Failed to create payment')
    }
  }

  async handleCallback(orderId: number) {
    try {
      // Update order status to 'paid'
      await this.orderRepository.update({ orderId }, { status: 'paid' })

      // Get order items and related product details
      const orderItems = await this.orderDetailRepository.find({
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

          // Update product details quantity
          await this.skincareProductDetailsRepository.update(
            { productDetailsId: detail.productDetailsId },
            { quantity: detail.quantity - updateQuantity }
          )

          remainingQuantity -= updateQuantity
        }

        // If there's still remaining quantity, reduce it from overall stock
        if (remainingQuantity > 0) {
          await this.skincareProductDetailsRepository.decrement(
            { product: { productId: item.product.productId } },
            'quantity',
            remainingQuantity
          )
        }

        // Update product stock in main table
        await this.skincareProductRepository.update(
          { productId: item.product.productId },
          { stock: item.product.stock - item.quantity }
        )
      }

      return {
        return_code: 1,
        return_message: 'success'
      }
    } catch (error) {
      console.error('Exception in callback:', error)
      return {
        return_code: 0,
        return_message: error.message
      }
    }
  }

  async orderStatus(orderId: number) {
    const app_trans_id = orderId
    const postData = {
      app_id: this.config.app_id,
      app_trans_id: app_trans_id
    }

    const data = `${postData.app_id}|${postData.app_trans_id}|${this.config.key1}`
    postData['mac'] = CryptoJS.HmacSHA256(data, this.config.key1).toString()

    try {
      const response = await axios.post(this.config.endpoint.replace('/create', '/query'), null, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        params: postData
      })
      return response.data
    } catch (error) {
      console.error('Query failed:', error)
      throw new BadRequestException('Query failed')
    }
  }

  async refundPayment(orderId: number) {}
}
