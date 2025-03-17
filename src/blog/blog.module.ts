import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blogs, SkincareProduct, User } from 'src/typeorm/entities';
import { BlogsService } from './blog.service';
import { BlogsController } from './blog.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Blogs, SkincareProduct])],
  controllers: [BlogsController],
  providers: [BlogsService]
})
export class BlogModule {}
