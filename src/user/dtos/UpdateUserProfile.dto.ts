import { IsNumber, IsOptional, IsString } from "class-validator"

export class updateUserProfileDto {
    @IsOptional()
    @IsString()
    username?: string

    @IsOptional()
    @IsString()
    phone?: string

    @IsOptional()
    @IsString()
    address?: string
}