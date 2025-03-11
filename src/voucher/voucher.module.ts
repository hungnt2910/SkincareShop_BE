import { Module } from '@nestjs/common';
import { VoucherController } from './voucher.controller';
import { VoucherService } from './voucher.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserVoucher, Voucher } from 'src/typeorm/entities';

@Module({
  imports: [TypeOrmModule.forFeature([UserVoucher, Voucher, User])],
  controllers: [VoucherController],
  providers: [VoucherService]
})
export class VoucherModule {}
