import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { CareRoute } from "./CareRoute";
import { SkincareProduct } from "./SkincareProduct";

@Entity()
export class CareRouteDetail {
    @PrimaryGeneratedColumn()
    careRouteDetailId: number;

    @ManyToOne(() => CareRoute, route => route.id)
    @JoinColumn({ name: 'care_route_id' })
    route: CareRoute;

    @ManyToOne(() => SkincareProduct, product => product.productId)
    @JoinColumn({ name: 'product_id' })
    product: SkincareProduct;

    @Column("text")
    instruction: string;

    @Column()
    step: string;
}
