import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/typeorm/entities/User'
import { Repository } from 'typeorm'
import { SignUpDto } from './dto/SignUpDto'
import * as bcrypt from 'bcrypt'
import { SignInDto } from './dto/SignInDto'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as crypto from 'crypto'
import * as nodemailer from 'nodemailer'
import { PasswordResetTokens, SkinTypeResult } from 'src/typeorm/entities'
import { ResetPasswordDto, ResetPasswordInfoDto } from './dto/ResetPasswordDto'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(PasswordResetTokens)
    private readonly PasswordResetTokens: Repository<PasswordResetTokens>,
    @InjectRepository(SkinTypeResult)
    private skinTypeResultRepository: Repository<SkinTypeResult>
  ) {}

  async signup(signupData: SignUpDto) {
    try {
      const { email, username, password } = signupData
      //Check if email is use
      const emailInUse = await this.userRepository.find({
        where: { email: signupData.email }
      })

      if (emailInUse.length !== 0) {
        throw new BadRequestException('Email already exist')
      }

      //Hash Password
      const hashedPassword = await bcrypt.hash(signupData.password, 10)

      const newUser = this.userRepository.create({
        email,
        username,
        password: hashedPassword,
        role: { roleId: 2 }
      })

      this.userRepository.save(newUser)
      return { message: 'Register success' }
    } catch (err) {
      throw new BadRequestException(err)
    }
  }

  async signin(signinData: SignInDto) {
    const { email, password } = signinData

    // Fetch user along with their role
    const user = await this.userRepository.findOne({
      where: { email: email },
      relations: ['role'] // Include role in the query
    })

    if (!user) {
      throw new UnauthorizedException('Wrong credentials')
    }

    const comparedPassword = await bcrypt.compare(password, user.password)
    if (!comparedPassword) {
      throw new UnauthorizedException('Wrong credentials')
    }
    const skinTypeResult = await this.skinTypeResultRepository.findOne({
      where: { customer: { id: user.id } },
      relations: ['customer', 'skinType']
    })

    if (!skinTypeResult) {
      return null
    }

    return this.generateUserTokens(user.id, user.role.roleName, skinTypeResult.skinTypeResultId)
  }

  async generateUserTokens(userId: number, role: string, skinType: any) {
    const accessToken = this.jwtService.sign({ userId, role, skinType }, { expiresIn: '1h' })

    return {
      accessToken
    }
  }

  async requestPasswordReset(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userRepository.findOne({ where: { email: resetPasswordDto.email } })
    if (!user) {
      throw new BadRequestException('User not found')
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 3600000) // valid for 1 hour

    const passwordResetTokens = new PasswordResetTokens()
    passwordResetTokens.user = user
    passwordResetTokens.token = token
    passwordResetTokens.expiredAt = expiresAt
    await this.PasswordResetTokens.save(passwordResetTokens)

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: this.configService.get('EMAIL'),
        pass: this.configService.get('EMAIL_PASSWORD')
      }
    })

    const resetLink = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}`
    await transporter.sendMail({
      to: user.email,
      from: this.configService.get('EMAIL'),
      subject: 'Password Reset Request for Skincare Shop Online Store',
      text: `You requested a password reset. Click the link below to reset your password:\n\n${resetLink}\n\nThis link will expire in 1 hour.`
    })

    return { success: true, message: 'Password reset link sent to email' }
  }

  async resetPassword(resetPasswordInfoDto: ResetPasswordInfoDto) {
    const passwordResetToken = await this.PasswordResetTokens.findOne({ where: { token: resetPasswordInfoDto.token } })
    if (!passwordResetToken) {
      throw new BadRequestException('Invalid or expired token')
    }

    const user = await this.userRepository.findOne({ where: { id: passwordResetToken.user.id } })
    if (!user) {
      throw new BadRequestException('User not found')
    }

    const hashedPassword = await bcrypt.hash(resetPasswordInfoDto.newPassword, 10)
    user.password = hashedPassword
    await this.userRepository.save(user)

    await this.PasswordResetTokens.delete({ user: { id: user.id } })

    return { success: true, message: 'Password reset successfully' }
  }
}
