/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { JwtModule } from '@nestjs/jwt'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { RoleModule } from './role/role.module'
import { SkincareProductModule } from './skincare-product/skincare-product.module'
import { SeederModule } from './seeder/seeder.module'
import { QuizModule } from './quiz/quiz.module'
import { OrdersModule } from './orders/orders.module'
import { AdminModule } from './admin/admin.module'
import { BrandModule } from './brand/brand.module'
import { PaymentModule } from './payment/payment.module'
import { SkincareRouteModule } from './skincare-route/skincare-route.module'
import { VoucherModule } from './voucher/voucher.module'
import { GgmeetModule } from './ggmeet/ggmeet.module'
import { DashboardModule } from './dashboard/dashboard.module'
import { ReviewsModule } from './reviews/reviews.module'
import { BlogModule } from './blog/blog.module'
import { CategoryModule } from './category/category.module'
import * as entities from './typeorm/entities'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    JwtModule.register({
      global: true,
      secret: '123'
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: Object.values(entities),
        synchronize: true
      }),
      inject: [ConfigService]
    }),
    UserModule,
    AuthModule,
    RoleModule,
    SkincareProductModule,
    SeederModule,
    SkincareProductModule,
    QuizModule,
    OrdersModule,
    AdminModule,
    BrandModule,
    PaymentModule,
    SkincareRouteModule,
    VoucherModule,
    DashboardModule,
    ReviewsModule,
    GgmeetModule,
    BlogModule,
    CategoryModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
