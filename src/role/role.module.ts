import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from './role.service';
import { Role } from 'src/typeorm/entities/Role';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
