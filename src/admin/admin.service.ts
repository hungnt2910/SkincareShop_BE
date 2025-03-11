import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/typeorm/entities'
import { Not, Repository } from 'typeorm'
import { UpdateUserDto } from './dtos/UpdateUser.dto'

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async getAllUser() {
    return await this.userRepository.find({
      where: { role: Not(1) }
    })
  }

  async deleteUser(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found')
    }
    user.status = false

    return this.userRepository.save(user)
  }

  async editUser(userInfo: UpdateUserDto, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } })

    if (!user) {
        throw new NotFoundException('User not found');
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
}
