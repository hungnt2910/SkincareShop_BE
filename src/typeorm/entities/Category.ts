import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { SkincareProduct } from "./SkincareProduct";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    categoryId: number;

    @Column()
    name: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @OneToMany(() => SkincareProduct, product => product.category)
    products: SkincareProduct[];
}
