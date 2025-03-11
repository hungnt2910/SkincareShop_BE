import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Blogs {
    @PrimaryGeneratedColumn()
    postId: number;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    title: string;

    @Column("text")
    description: string;

    @Column()
    imageUrl: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    postDate: Date;
}
