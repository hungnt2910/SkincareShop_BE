import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { SkincareProduct } from "./SkincareProduct";

@Entity()
export class Brand {
    @PrimaryGeneratedColumn()
    brandId: number;

    @Column()
    brandName: string;

    @Column()
    country: string;

    @Column()
    logo: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column({ default: true })
    isActive: boolean;

    @OneToMany(() => SkincareProduct, product => product.brand)
    products: SkincareProduct[];
}
