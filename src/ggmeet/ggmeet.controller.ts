import { Body, Controller, Get, Post } from '@nestjs/common'
import { GoogleService } from './ggmeet.service'

@Controller('ggmeet')
export class GgmeetController {
  constructor(private readonly googleService: GoogleService) {}

  @Get('meet')
  async createMeetLink() {
    const meetLink = await this.googleService.createGoogleCalendarEvent()
    return { meetLink }
  }

  @Post('getMeet')
  async getMeetForStaff(@Body() url: string) {
    return this.googleService.checkAndReturnURL(url)
  }
}
