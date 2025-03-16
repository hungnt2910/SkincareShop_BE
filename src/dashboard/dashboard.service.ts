import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brand, OrderDetail, Orders, SkincareProduct } from 'src/typeorm/entities'
import { Repository } from 'typeorm'

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Orders) private readonly orderRepository: Repository<Orders>,
    @InjectRepository(OrderDetail) private readonly orderItemRepository: Repository<OrderDetail>,
    @InjectRepository(SkincareProduct) private readonly productRepository: Repository<SkincareProduct>,
    @InjectRepository(Brand) private readonly brandRepository: Repository<Brand>
  ) {}

  async getDashboard(startDate: string, endDate: string) {
    try {
      // Convert input dates from dd-MM-yyyy to Date objects
      const [startDay, startMonth, startYear] = startDate.split('-').map(Number)
      const [endDay, endMonth, endYear] = endDate.split('-').map(Number)
      const start = new Date(startYear, startMonth - 1, startDay)
      const end = new Date(endYear, endMonth - 1, endDay)

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new BadRequestException('Invalid date format')
      }

      const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      const calculatePerDay = duration < 31

      // Total Orders
      const totalOrders = await this.orderRepository
        .createQueryBuilder('order')
        .where('order.timestamp BETWEEN :start AND :end', { start, end })
        .andWhere('order.status IN (:...statuses)', {
          statuses: ['Paid', 'Delivered', 'Completed', 'Confirmed']
        })
        .getCount()

      // Total Revenue
      const totalRevenue = await this.orderRepository
        .createQueryBuilder('order')
        .select('SUM(order.amount)', 'totalRevenue')
        .where('order.timestamp BETWEEN :start AND :end', { start, end })
        .andWhere('order.status IN (:...statuses)', {
          statuses: ['Paid', 'Delivered', 'Completed', 'Confirmed']
        })
        .getRawOne()

      // Top 12 Best-Selling Brands
      const topProducts = await this.orderItemRepository
        .createQueryBuilder('orderItem')
        .innerJoin('orderItem.product', 'product')
        .innerJoin('orderItem.order', 'order')
        .innerJoin('product.brand', 'brand')
        .select('brand.brandId', 'brandId')
        .addSelect('brand.brandName', 'brandName')
        .addSelect('SUM(orderItem.quantity)', 'totalSold')
        .where('order.timestamp BETWEEN :start AND :end', { start, end })
        .andWhere('order.status IN (:...statuses)', {
          statuses: ['Paid', 'Delivered', 'Completed', 'Confirmed']
        })
        .groupBy('brand.brandId, brand.brandName')
        .orderBy('SUM(orderItem.quantity)', 'DESC')
        .limit(12)
        .getRawMany()

      // Successful Orders Per Month
      const successfulOrdersPerMonth = await this.orderRepository
        .createQueryBuilder('order')
        .select(`DATE_FORMAT(order.timestamp, '%m-%Y')`, 'yearMonth')
        .addSelect('COUNT(*)', 'successfulOrders')
        .where('order.timestamp BETWEEN :start AND :end', { start, end })
        .andWhere('order.status IN (:...statuses)', {
          statuses: ['Paid', 'Delivered', 'Completed', 'Confirmed']
        })
        .groupBy('yearMonth')
        .orderBy('yearMonth', 'ASC')
        .getRawMany()

      // Canceled Orders Per Month
      const canceledOrdersPerMonth = await this.orderRepository
        .createQueryBuilder('order')
        .where('order.timestamp BETWEEN :start AND :end', { start, end })
        .andWhere('order.status = :status', { status: 'Cancelled' })
        .getCount()

      // Revenue Per Period (Daily or Monthly)
      let totalRevenuePerPeriod
      if (calculatePerDay) {
        totalRevenuePerPeriod = await this.orderRepository
          .createQueryBuilder('order')
          .select(`DATE_FORMAT(order.timestamp, '%d-%m-%Y')`, 'periodMonth')
          .addSelect('SUM(order.amount)', 'totalRevenue')
          .where('order.timestamp BETWEEN :start AND :end', { start, end })
          .andWhere('order.status IN (:...statuses)', {
            statuses: ['Paid', 'Delivered', 'Completed', 'Confirmed']
          })
          .groupBy('periodMonth')
          .orderBy('periodMonth', 'ASC')
          .getRawMany()
      } else {
        totalRevenuePerPeriod = await this.orderRepository
          .createQueryBuilder('order')
          .select(`DATE_FORMAT(order.timestamp, '%m-%Y')`, 'periodMonth')
          .addSelect('SUM(order.amount)', 'totalRevenue')
          .where('order.timestamp BETWEEN :start AND :end', { start, end })
          .andWhere('order.status IN (:...statuses)', {
            statuses: ['Paid', 'Delivered', 'Completed', 'Confirmed']
          })
          .groupBy('periodMonth')
          .orderBy('periodMonth', 'ASC')
          .getRawMany()
      }

      return {
        totalOrders,
        totalRevenue: totalRevenue.totalRevenue || 0,
        topProducts,
        successfulOrdersPerMonth,
        canceledOrdersPerMonth,
        totalRevenuePerPeriod
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      throw new InternalServerErrorException(error.message)
    }
  }
}
