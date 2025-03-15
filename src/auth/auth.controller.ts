import { Controller, Get, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignUpDto } from './dto/SignUpDto'
import { SignInDto } from './dto/SignInDto'

@Controller('auth')
// @UsePipes(new ValidationPipe({ whitelist: true }))
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
}
