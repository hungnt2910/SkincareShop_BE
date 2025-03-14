import { Injectable, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createPool } from 'mysql2'

@Injectable()
export class DashboardService {
  private pool

  constructor(private readonly configService: ConfigService) {
    this.pool = createPool({
      host: this.configService.get<string>('DB_HOST'),
      user: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME')
    })
  }

  async getDashboard(startDate: string, endDate: string) {
    try {
      // Convert date format to yyyy-MM-dd
      const [startDay, startMonth, startYear] = startDate.split('-').map(Number)
      const [endDay, endMonth, endYear] = endDate.split('-').map(Number)
      const start = new Date(startYear, startMonth - 1, startDay)
      const end = new Date(endYear, endMonth - 1, endDay)

      const startDateString = `${startYear}-${String(startMonth).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`
      const endDateString = `${endYear}-${String(endMonth).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`

      const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      const calculatePerDay = duration < 31

      const connection = await this.pool.getConnection()

      // Total Orders
      const [totalOrdersResult] = await connection.query(
        `SELECT COUNT(*) AS totalOrders 
        FROM Orders 
        WHERE order_date BETWEEN ? AND ?
        AND status IN ('Paid', 'Delivered', 'Completed', 'Confirmed')`,
        [startDateString, endDateString]
      )
      const totalOrders = totalOrdersResult[0].totalOrders

      // Total Revenue
      const [totalRevenueResult] = await connection.query(
        `SELECT SUM(total_amount) AS totalRevenue 
        FROM Orders 
        WHERE order_date BETWEEN ? AND ?
        AND status IN ('Paid', 'Delivered', 'Completed', 'Confirmed')`,
        [startDateString, endDateString]
      )
      const totalRevenue = totalRevenueResult[0].totalRevenue || 0

      // Top 12 Best-Selling Brands
      const [topProductsResult] = await connection.query(
        `SELECT b.brand_id, b.brand_name, SUM(oi.quantity) AS totalSold 
        FROM Order_Items oi
        JOIN Products p ON oi.product_id = p.product_id
        JOIN Orders o ON oi.order_id = o.order_id
        JOIN Brands b ON p.brand_id = b.brand_id
        WHERE o.order_date BETWEEN ? AND ?
        AND o.status IN ('Paid', 'Delivered', 'Completed', 'Confirmed')
        GROUP BY b.brand_id, b.brand_name
        ORDER BY totalSold DESC
        LIMIT 12`,
        [startDateString, endDateString]
      )

      // Successful Orders Per Month
      const [successfulOrdersPerMonthResult] = await connection.query(
        `SELECT DATE_FORMAT(order_date, '%m-%Y') AS yearMonth, COUNT(*) AS successfulOrders
        FROM Orders
        WHERE order_date BETWEEN ? AND ?
        AND status IN ('Paid', 'Delivered', 'Completed', 'Confirmed')
        GROUP BY DATE_FORMAT(order_date, '%m-%Y')
        ORDER BY yearMonth`,
        [startDateString, endDateString]
      )

      // Total Canceled Orders
      const [canceledOrdersPerMonthResult] = await connection.query(
        `SELECT COUNT(*) AS totalCancelledOrders
        FROM Orders
        WHERE order_date BETWEEN ? AND ?
        AND status = 'Cancelled'`,
        [startDateString, endDateString]
      )
      const canceledOrdersPerMonth = canceledOrdersPerMonthResult[0].totalCancelledOrders

      // Total Revenue Per Period (Per Day or Per Month)
      const totalRevenuePerPeriodQuery = calculatePerDay
        ? `SELECT DATE_FORMAT(order_date, '%d-%m-%Y') AS periodMonth, 
                  IFNULL(SUM(total_amount), 0) AS totalRevenue
           FROM Orders
           WHERE order_date BETWEEN ? AND ?
           AND status IN ('Paid', 'Delivered', 'Completed', 'Confirmed')
           GROUP BY DATE_FORMAT(order_date, '%d-%m-%Y')
           ORDER BY periodMonth`
        : `SELECT DATE_FORMAT(order_date, '%m-%Y') AS periodMonth, 
                  IFNULL(SUM(total_amount), 0) AS totalRevenue
           FROM Orders
           WHERE order_date BETWEEN ? AND ?
           AND status IN ('Paid', 'Delivered', 'Completed', 'Confirmed')
           GROUP BY DATE_FORMAT(order_date, '%m-%Y')
           ORDER BY periodMonth`

      const [totalRevenuePerPeriodResult] = await connection.query(totalRevenuePerPeriodQuery, [
        startDateString,
        endDateString
      ])

      connection.release()

      return {
        totalOrders,
        totalRevenue,
        topProducts: topProductsResult,
        successfulOrdersPerMonth: successfulOrdersPerMonthResult,
        canceledOrdersPerMonth,
        totalRevenuePerPeriod: totalRevenuePerPeriodResult
      }
    } catch (error) {
      console.error('Error in getDashboard:', error)
      throw new BadRequestException(error.message)
    }
  }
}
