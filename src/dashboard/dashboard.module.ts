import { Module } from '@nestjs/common'
import { DashboardController } from './dashboard.controller'
import { DashboardService } from './dashboard.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Or } from 'typeorm'
import { Brand, OrderDetail, Orders, SkincareProduct } from 'src/typeorm/entities'

@Module({
  imports: [TypeOrmModule.forFeature([Orders, OrderDetail, SkincareProduct, Brand])],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule {}
