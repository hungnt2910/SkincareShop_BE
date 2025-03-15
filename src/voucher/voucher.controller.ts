import { Controller, UseGuards, Post, Body, Put, Param, Get, UsePipes, ValidationPipe } from '@nestjs/common'
import { AuthGuard } from 'src/guards/auth.guard'
import { VoucherService } from './voucher.service'
import { applyVoucherDto, claimVoucherDto, createVoucherDto, updateVoucherDto } from './dtos/voucher-dto'

@Controller('voucher')
// @UsePipes(new ValidationPipe({ whitelist: true }))
export class VoucherController {
  constructor(private voucherService: VoucherService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  createVoucher(@Body() createVoucherDto: createVoucherDto) {
    return this.voucherService.createVoucher(createVoucherDto)
  }

  @UseGuards(AuthGuard)
  @Put('update/:voucherId')
  updateVoucher(@Param('voucherId') voucherId: number, @Body() updateVoucherDto: updateVoucherDto) {
    return this.voucherService.updateVoucher(voucherId, updateVoucherDto)
  }

  @UseGuards(AuthGuard)
  @Post('claim')
  claimVoucher(@Body() claimVoucherDto: claimVoucherDto) {
    return this.voucherService.claimVoucher(claimVoucherDto)
  }

  @Get('get-all')
  getAllVouchers() {
    return this.voucherService.getAllVouchers()
  }

  @UseGuards(AuthGuard)
  @Post('apply')
  applyVoucher(@Body() applyVoucherDto: applyVoucherDto) {
    return this.voucherService.applyVoucher(applyVoucherDto)
  }

  @UseGuards(AuthGuard)
  @Get('getVoucherByUser/:userId')
  getVoucherByUser(@Param('userId') userId: number) {
    return this.voucherService.getVoucherByUser(userId)
  }
}
