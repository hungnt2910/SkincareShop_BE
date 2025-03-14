import { IsEmail, IsIn, IsInt, IsString, Matches, MinLength } from 'class-validator'

export class AdminCreateUserDto {
  @IsEmail()
  email: string

  @IsString()
  username: string

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[0-9])/, { message: 'Password must contain at least one number' })
  password: string

  @IsInt()
  @IsIn([1, 2, 3, 4], { message: 'Role ID must be Admin, User, Staff and Shipper' })
  roleId: number
}
