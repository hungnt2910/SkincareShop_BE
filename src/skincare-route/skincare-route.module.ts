import { Module } from '@nestjs/common';
import { SkincareRouteController } from './skincare-route.controller';
import { SkincareRouteService } from './skincare-route.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareRoute, User } from 'src/typeorm/entities';

@Module({
  imports: [TypeOrmModule.forFeature([CareRoute, User])],
  controllers: [SkincareRouteController],
  providers: [SkincareRouteService],
})
export class SkincareRouteModule {}
