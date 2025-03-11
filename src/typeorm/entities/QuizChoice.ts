import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Quiz } from "./Quiz";

@Entity()
export class QuizChoice {
    @PrimaryGeneratedColumn()
    quizChoiceId: number;

    @ManyToOne(() => Quiz, quiz => quiz.quizId)
    @JoinColumn({ name: 'quiz_id' })
    quiz: Quiz;

    @Column()
    choice: string;
}
