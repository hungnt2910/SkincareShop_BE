import { IsOptional, IsString } from "class-validator";

export class UpdateUserDto{
    @IsOptional()
    @IsString()
    username?: string

    @IsOptional()
    @IsString()
    phone?: string

    @IsOptional()
    @IsString()
    address?: string

    @IsOptional()
    @IsString()
    email?: string
}