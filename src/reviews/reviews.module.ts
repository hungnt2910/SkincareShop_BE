import { Module } from '@nestjs/common'
import { ReviewsController } from './reviews.controller'
import { ReviewsService } from './reviews.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Orders, Reviews, SkincareProduct, User } from 'src/typeorm/entities'

@Module({
  imports: [TypeOrmModule.forFeature([Reviews, SkincareProduct, Orders, User])],
  controllers: [ReviewsController],
  providers: [ReviewsService]
})
export class ReviewsModule {}
