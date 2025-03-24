import { Controller, Get, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignUpDto } from './dto/SignUpDto'
import { SignInDto } from './dto/SignInDto'
import { ResetPasswordDto, ResetPasswordInfoDto } from './dto/ResetPasswordDto'

@Controller('auth')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpData: SignUpDto) {
    return this.authService.signup(signUpData)
  }

  @Post('signin')
  async signIn(@Body() signInData: SignInDto) {
    return this.authService.signin(signInData)
  }

  @Post('request-password-reset')
  async requestPasswordReset(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.requestPasswordReset(resetPasswordDto)
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordInfoDto: ResetPasswordInfoDto) {
    return this.authService.resetPassword(resetPasswordInfoDto)
  }
}
