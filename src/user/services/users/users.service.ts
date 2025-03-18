import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/typeorm/entities/User'
import { updateUserProfileDto } from 'src/user/dtos/UpdateUserProfile.dto'
import { CreateUserParams } from 'src/utils/types'
import { Repository } from 'typeorm'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async findUser(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return user
  }

  async getCustomer() {
    const user = await this.userRepository.find({where: {role: {roleId: 2}}})
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return user;
  }

  async updateUserProfile(userInfo: updateUserProfileDto, userId: number) {
    const user = await this.findUser(userId)

    if ('email' in userInfo) {
      throw new BadRequestException('Email cannot be updated')
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

    return this.userRepository.save(user)
  }
}
