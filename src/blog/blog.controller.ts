import { Controller, Post, Get, Put, Delete, Param, Body, UsePipes, ValidationPipe } from '@nestjs/common'
import { CreateBlogDto } from './dtos/create-blog.dto'
import { UpdateBlogDto } from './dtos/update-blog.dto'
import { BlogsService } from './blog.service'

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createBlog(@Body() dto: CreateBlogDto) {
    return this.blogsService.createBlog(dto)
  }

  @Get()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async getAllBlogs() {
    return this.blogsService.getAllBlogs()
  }

  @Get(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async getBlog(@Param('id') id: number) {
    return this.blogsService.getBlog(id)
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateBlog(@Param('id') id: number, @Body() dto: UpdateBlogDto) {
    return this.blogsService.updateBlog(id, dto)
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async deleteBlog(@Param('id') id: number) {
    return this.blogsService.deleteBlog(id)
  }
}
