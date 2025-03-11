import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { QuizChoice } from "./QuizChoice";

@Entity()
export class Quiz {
    @PrimaryGeneratedColumn()
    quizId: number;

    @Column()
    title: string;

    @OneToMany(() => QuizChoice, choice => choice.quiz)
    choices: QuizChoice[];
}
