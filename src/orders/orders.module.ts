import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { OrdersController } from './orders.controller'
import { OrdersService } from './orders.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
  OrderDetail,
  Orders,
  ReturnOrderDetail,
  SkincareProduct,
  SkincareProductDetails,
  User
} from 'src/typeorm/entities'
import { OrdersMiddleware } from './orders.middleware'

@Module({
  imports: [
    TypeOrmModule.forFeature([Orders, OrderDetail, SkincareProduct, SkincareProductDetails, User, ReturnOrderDetail])
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersMiddleware],
  exports: [OrdersService]
})
export class OrdersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(OrdersMiddleware).forRoutes({ path: 'orders/confirm/:orderId', method: RequestMethod.PUT })
  }
}
