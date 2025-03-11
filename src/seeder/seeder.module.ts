import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand, Category, Role, SkincareProduct, SkinType, User } from 'src/typeorm/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Role, SkincareProduct, Category, Brand, User, SkinType])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
