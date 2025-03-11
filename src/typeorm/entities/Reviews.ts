import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { SkincareProduct } from "./SkincareProduct";
import { User } from "./User";

@Entity()
export class Reviews {
    @PrimaryGeneratedColumn()
    reviewId: number;

    @ManyToOne(() => SkincareProduct, product => product.productId)
    @JoinColumn({ name: 'product_id' })
    product: SkincareProduct;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column("int")
    rating: number;

    @Column("text")
    comment: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    reviewDate: Date;
}
