import { IsNotEmpty, IsArray } from 'class-validator';

export class CreateSkincareRoutineDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  skinType: string;

  @IsNotEmpty()
  concerns: string;

  @IsArray()
  morningRoutine: string[];


  @IsArray()
  eveningRoutine: string[];

  @IsArray()
  recommendedProducts: string[];
}
