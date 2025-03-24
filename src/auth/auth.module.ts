import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/typeorm/entities/User'
import { PasswordResetTokens, SkinTypeResult } from 'src/typeorm/entities'

@Module({
  imports: [TypeOrmModule.forFeature([User, PasswordResetTokens, SkinTypeResult])],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
