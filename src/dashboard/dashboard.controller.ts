import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { DashboardService } from './dashboard.service'
import { Roles } from 'src/role/roles.decorator'
import { AuthGuard } from 'src/guards/auth.guard'

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @UseGuards(AuthGuard)
  @Roles('Admin')
  async getDashboard(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.dashboardService.getDashboard(startDate, endDate)
  }
}
