import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Category } from "./Category";
import { Brand } from "./Brand";
import { Reviews } from "./Reviews";
import { OrderDetail } from "./OrderDetail";

@Entity()
export class SkincareProduct {
    @PrimaryGeneratedColumn()
    productId: number;

    @Column()
    productName: string;

    @ManyToOne(() => Category, category => category.products)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @ManyToOne(() => Brand, brand => brand.products)
    @JoinColumn({ name: 'brand_id' })
    brand: Brand;

    @Column("text")
    description: string;

    @Column("float")
    price: number;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column()
    stock: number;

    @Column({ type: "text", nullable: true })
    urlImage: string;

    @OneToMany(() => OrderDetail, orderDetail => orderDetail.product)
    orderDetails: OrderDetail[];

    @OneToMany(() => Reviews, review => review.product)
    reviews: Reviews[];
}
