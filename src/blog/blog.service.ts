import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Blogs, SkincareProduct, User } from 'src/typeorm/entities'
import { Repository } from 'typeorm'
import { CreateBlogDto } from './dtos/create-blog.dto'
import { UpdateBlogDto } from './dtos/update-blog.dto'

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blogs)
    private readonly blogsRepository: Repository<Blogs>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(SkincareProduct)
    private readonly productRepository: Repository<SkincareProduct>
  ) {}

  async getAllBlogs() {
    return this.blogsRepository.find({
      relations: ['user', 'product'],
      order: { postId: 'DESC' }
    })
  }

  // Get a single blog by ID with user and product details
  async getBlog(id: number) {
    const blog = await this.blogsRepository.findOne({
      where: { postId: id },
      relations: ['user', 'product']
    })

    if (!blog) throw new NotFoundException('Blog not found')

    return blog
  }

  async createBlog(dto: CreateBlogDto) {
    const { user_id, title, description, image_url, product_id } = dto

    const user = await this.userRepository.findOne({ where: { id: user_id } })
    if (!user) throw new Error('User not found')

    const product = product_id ? await this.productRepository.findOne({ where: { productId: product_id } }) : null

    const blog = this.blogsRepository.create({
      user,
      title,
      description,
      imageUrl: image_url,
      product: { productId: 1 }
    })

    await this.blogsRepository.save(blog)
    return { success: true, message: 'Blog created successfully', blog }
  }

  async updateBlog(id: number, dto: UpdateBlogDto) {
    const blog = await this.blogsRepository.findOne({ where: { postId: id } })
    if (!blog) throw new Error('Blog not found')

    if (dto.user_id) {
      const user = await this.userRepository.findOne({ where: { id: dto.user_id } })
      if (!user) throw new Error('User not found')
      blog.user = user
    }

    if (dto.product_id) {
      const product = await this.productRepository.findOne({ where: { productId: dto.product_id } })
      if (!product) throw new Error('Product not found')
      blog.product = product
    }

    // Only update image_url if it exists in dto
    if (dto.image_url) {
      blog.imageUrl = dto.image_url
    }

    Object.assign(blog, dto)
    await this.blogsRepository.save(blog)

    return { success: true, message: 'Blog updated successfully', blog }
  }

  async deleteBlog(id: number) {
    const result = await this.blogsRepository.delete(id)
    if (result.affected === 0) throw new Error('Blog not found')

    return { success: true, message: 'Blog deleted successfully' }
  }
}
