import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { SkincareProduct } from "./SkincareProduct";
import { SkinType } from "./SkinType";

@Entity()
export class SkinTypeDetails {
    @PrimaryGeneratedColumn()
    skinTypeDetailsId: number;

    @ManyToOne(() => SkinType, skinType => skinType.skinTypeId)
    @JoinColumn({ name: 'skin_type_id' })
    skinType: SkinType;

    @ManyToOne(() => SkincareProduct, product => product.productId)
    @JoinColumn({ name: 'product_id' })
    product: SkincareProduct;
}
