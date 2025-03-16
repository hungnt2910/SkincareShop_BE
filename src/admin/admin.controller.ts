import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common'
import { AdminService } from './admin.service'
import { UpdateUserDto } from './dtos/UpdateUser.dto'
import { AuthGuard } from 'src/guards/auth.guard'
import { Roles } from 'src/role/roles.decorator'
import { AdminCreateUserDto } from './dtos/CreateUser.dto'

@Controller('admin')
// @UsePipes(new ValidationPipe({ whitelist: true }))
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('user')
  getAllAccount() {
    return this.adminService.getAllUser()
  }

  @Delete('user/:userId')
  @UseGuards(AuthGuard)
  @Roles('Admin')
  removeUser(@Param('userId') userId: number) {
    return this.adminService.deleteUser(userId)
  }

  @Put('user/:userId')
  @UseGuards(AuthGuard)
  @Roles('Admin')
  editUserProfile(@Body() userInfo: UpdateUserDto, @Param('userId') userId: number) {
    return this.adminService.editUser(userInfo, userId)
  }

  @Post('createUser')
  @UseGuards(AuthGuard)
  @Roles('Admin')
  createUser(@Body() userInfo: AdminCreateUserDto) {
    return this.adminService.createUser(userInfo)
  }
}
