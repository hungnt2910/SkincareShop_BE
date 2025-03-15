import { Controller, Get, Query, UseGuards, BadRequestException } from '@nestjs/common'
import { DashboardService } from './dashboard.service'
import { Roles } from 'src/role/roles.decorator'
import { AuthGuard } from 'src/guards/auth.guard'

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getDashboard(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    if (!startDate || !endDate || !/^\d{2}-\d{2}-\d{4}$/.test(startDate) || !/^\d{2}-\d{2}-\d{4}$/.test(endDate)) {
      throw new BadRequestException('Please provide both startDate and endDate in the format dd-MM-yyyy.')
    }

    return this.dashboardService.getDashboard(startDate, endDate)
  }
}
