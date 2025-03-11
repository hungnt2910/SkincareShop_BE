import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/typeorm/entities/User'
import { Repository } from 'typeorm'
import { SignUpDto } from './dto/SignUpDto'
import * as bcrypt from 'bcrypt'
import { SignInDto } from './dto/SignInDto'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService
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

    return this.generateUserTokens(user.id, user.role.roleName)
  }

  async generateUserTokens(userId: number, role: string) {
    const accessToken = this.jwtService.sign({ userId, role }, { expiresIn: '1h' })

    return {
      accessToken
    }
  }
}
