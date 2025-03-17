import { IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class CreateBlogDto {
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  image_url?: string;

  @IsOptional()
  product_id?: number;
}
