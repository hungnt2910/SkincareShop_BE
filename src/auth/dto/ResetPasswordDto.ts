import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator'

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string
}

export class ResetPasswordInfoDto {
  @IsNotEmpty({ message: 'Token is required' })
  token: string

  @IsNotEmpty({ message: 'New password is required' })
  @MinLength(6)
  @Matches(/^(?=.*[0-9])/, { message: 'Password must contain at least one number' })
  newPassword: string
}
