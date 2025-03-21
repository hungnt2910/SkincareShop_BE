import { IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class AssignStaff {
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  staff_id: number;
}
