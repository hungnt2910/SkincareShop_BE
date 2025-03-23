import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { GoogleMeetService } from './ggmeet.service'
import { AssignStaff } from './dtos/assignStaff'

@Controller('ggmeet')
export class GgmeetController {
  constructor(private readonly googleService: GoogleMeetService) {}

  @Post('meet/:id')
  async createMeetLink(@Param('id') id: number) {
    console.log(id)
    const meetLink = await this.googleService.createGoogleMeetLink(id)
    return { meetLink }
  }

  @Post('getMeet')
  async getMeetForStaff(@Body() assignStaff: AssignStaff) {
    return this.googleService.assignStaffToMeetLink(assignStaff)
  }

  @Get()
  async getAllMeet(){
    return this.googleService.getAllMeets()
  }
}
