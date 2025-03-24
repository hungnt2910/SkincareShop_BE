import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/typeorm/entities'
import { Not, Repository } from 'typeorm'
import { UpdateUserDto } from './dtos/UpdateUser.dto'
import { AdminCreateUserDto } from './dtos/CreateUser.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async getAllUser() {
    return await this.userRepository.find({
      where: { role: Not(1) },
      relations: ['role']
    })
  }

  async deleteUser(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } })

    if (!user) {
      throw new NotFoundException('User not found')
    }
    user.status = false

    return this.userRepository.save(user)
  }

  async editUser(userInfo: UpdateUserDto, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    if (userInfo.username !== undefined) {
      user.username = userInfo.username
    }
    if (userInfo.phone !== undefined) {
      user.phone = userInfo.phone
    }
    if (userInfo.address !== undefined) {
      user.address = userInfo.address
    }
    if (userInfo.email !== undefined) {
      user.email = userInfo.email
    }

    return this.userRepository.save(user)
  }

  async createUser(userInfo: AdminCreateUserDto) {
    try {
      const { username, email, password } = userInfo

      const emailInUse = await this.userRepository.find({
        where: { email: userInfo.email }
      })

      if (emailInUse.length !== 0) {
        throw new BadRequestException('Email already exist')
      }

      const hasedPassword = await bcrypt.hash(userInfo.password, 10)

      const newUser = this.userRepository.create({
        username,
        email,
        password: hasedPassword,
        role: { roleId: userInfo.roleId }
      })

      this.userRepository.save(newUser)

      return { message: 'User created successfully' }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
