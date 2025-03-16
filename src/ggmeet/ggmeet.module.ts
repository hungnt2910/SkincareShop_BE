import { Module } from '@nestjs/common';
import { GgmeetController } from './ggmeet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities';
import { GoogleService } from './ggmeet.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [GgmeetController],
  providers: [GoogleService]
})
export class GgmeetModule {}
