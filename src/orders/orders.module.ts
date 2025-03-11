import { Module } from '@nestjs/common'
import { OrdersController } from './orders.controller'
import { OrdersService } from './orders.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OrderDetail, Orders, SkincareProduct, SkincareProductDetails, User } from 'src/typeorm/entities'

@Module({
  imports: [TypeOrmModule.forFeature([Orders, OrderDetail, SkincareProduct, SkincareProductDetails, User])],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService]
})
export class OrdersModule {}
