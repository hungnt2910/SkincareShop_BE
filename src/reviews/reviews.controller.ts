import { Body, Controller, Get, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common'
import { AuthGuard } from 'src/guards/auth.guard'
import { ReviewsService } from './reviews.service'
import { ReviewByProductIdDto } from './dtos/reviews-dto'

@Controller('reviews')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post('reviewByProductId')
  @UseGuards(AuthGuard)
  reviewByProductId(@Body() reviewByProductIdDto: ReviewByProductIdDto) {
    return this.reviewsService.reviewByProductId(reviewByProductIdDto)
  }

  @Get('getReviewsByProductId/:productId')
  getReviewsByProductId(@Param('productId') productId: number) {
    return this.reviewsService.getReviewsByProductId(productId)
  }
}
