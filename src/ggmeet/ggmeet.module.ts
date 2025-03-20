import { Module } from '@nestjs/common';
import { GgmeetController } from './ggmeet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities';
import { GoogleMeetService } from './ggmeet.service';
import { Meet } from 'src/typeorm/entities/Meet';

@Module({
  imports: [TypeOrmModule.forFeature([User, Meet])],
  controllers: [GgmeetController],
  providers: [GoogleMeetService]
})
export class GgmeetModule {}
