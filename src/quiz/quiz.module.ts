import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz, QuizChoice, SkinType, SkinTypeResult, User } from 'src/typeorm/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz, QuizChoice, User, SkinType, SkinTypeResult])],
  providers: [QuizService],
  controllers: [QuizController]
})
export class QuizModule {}
