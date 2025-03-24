import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Orders, Reviews, SkincareProduct, User } from 'src/typeorm/entities'
import { In, Repository } from 'typeorm'
import { ReviewByProductIdDto } from './dtos/reviews-dto'

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Reviews)
    private reviewsRepository: Repository<Reviews>,
    @InjectRepository(SkincareProduct)
    private skincareProductRepository: Repository<SkincareProduct>,
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async getAllReviews() {
    const reviews = await this.reviewsRepository.find({
      relations: ['product', 'user', 'order']
    })

    return reviews.map((review) => ({
      reviewId: review.reviewId,
      productId: review.product.productId,
      productName: review.product.productName,
      userId: review.user.id,
      username: review.user.username,
      orderId: review.order.orderId,
      rating: review.rating,
      comment: review.comment,
      reviewDate: review.reviewDate
    }))
  }
  async reviewByProductId(reviewByProductIdDto: ReviewByProductIdDto) {
    const existingReview = await this.reviewsRepository.findOne({
      where: {
        product: { productId: reviewByProductIdDto.productId },
        user: { id: reviewByProductIdDto.userId },
        order: { orderId: reviewByProductIdDto.orderId }
      }
    })

    const product = await this.skincareProductRepository.findOne({
      where: { productId: reviewByProductIdDto.productId }
    })

    if (!product) {
      throw new BadRequestException('Product not found')
    }

    const order = await this.ordersRepository.findOne({
      where: { orderId: reviewByProductIdDto.orderId }
    })

    if (!order) {
      throw new BadRequestException('Order not found')
    }

    const user = await this.userRepository.findOne({
      where: { id: reviewByProductIdDto.userId }
    })

    if (!user) {
      throw new BadRequestException('User not found')
    }

    const review = new Reviews()
    review.product = product
    review.user = user
    review.order = order
    review.rating = reviewByProductIdDto.rating
    review.comment = reviewByProductIdDto.comment

    if (existingReview) {
      return {
        success: false,
        message: 'You have already reviewed this product in this order'
      }
    } else {
      await this.reviewsRepository.save(review)
      return {
        success: true,
        message: 'Review created successfully'
      }
    }
  }

  async getReviewsByProductId(productId: number) {
    const reviews = await this.reviewsRepository.find({
      where: { product: { productId: productId } },
      relations: ['user']
    })

    return reviews.map((review) => ({
      reviewId: review.reviewId,
      rating: review.rating,
      comment: review.comment,
      reviewDate: review.reviewDate,
      userId: review.user.id,
      username: review.user.username
    }))
  }
}
