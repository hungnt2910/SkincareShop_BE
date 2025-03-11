import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { SkincareProduct } from "./SkincareProduct";
import { User } from "./User";

@Entity()
export class LoyaltyProduct {
    @PrimaryGeneratedColumn()
    loyaltyProductId: number;

    @ManyToOne(() => SkincareProduct, product => product.productId)
    @JoinColumn({ name: 'product_id' })
    product: SkincareProduct;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: 'user_id' })
    customer: User;

    @Column()
    pointUsed: number;
}
