import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { SkinType } from "./SkinType";
import { User } from "./User";

@Entity()
export class SkinTypeResult {
    @PrimaryGeneratedColumn()
    skinTypeResultId: number;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: 'user_id' })
    customer: User;

    @ManyToOne(() => SkinType, skinType => skinType.type)
    skinType: SkinType;

    @Column()
    resultTime: string;
}
