import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common'
import { SkincareRouteService } from './skincare-route.service'
import { CreateSkincareRoutineDto } from './dtos/create-skincare-routine.dto'

@Controller('skincare-route')
// @UsePipes(new ValidationPipe({ whitelist: true }))
export class SkincareRouteController {
  constructor(private readonly skincareRouteService: SkincareRouteService) {}

  @Post()
  async createSkincareRoutine(@Body() createSkincareRoutineDto: CreateSkincareRoutineDto) {
    return this.skincareRouteService.createSkincareRoutine(createSkincareRoutineDto)
  }

  @Get(':userId')
  async getUserSkincareRoutine(@Param('userId', ParseIntPipe) userId: number) {
    return this.skincareRouteService.getUserSkincareRoutine(userId)
  }
}
