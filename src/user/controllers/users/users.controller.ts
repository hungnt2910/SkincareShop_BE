import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common'
import { CreateUserDto } from 'src/user/dtos/CreateUser.dto'
import { updateUserProfileDto } from 'src/user/dtos/UpdateUserProfile.dto'
import { UsersService } from 'src/user/services/users/users.service'

@Controller('users')
// @UsePipes(new ValidationPipe({ whitelist: true }))
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get(':userId')
  getUser(@Param('userId') userId: number) {
    console.log(typeof userId)
    return this.userService.findUser(userId)
  }

  @Put(':userId')
  updateUserProfile(@Body() userInfo: updateUserProfileDto, @Param('userId') userId: number) {
    return this.userService.updateUserProfile(userInfo, userId)
  }
}
