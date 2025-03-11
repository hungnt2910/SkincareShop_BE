import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { SkincareProduct } from './SkincareProduct'

@Entity()
export class SkincareProductDetails {
  @PrimaryGeneratedColumn()
  productDetailsId: number

  @ManyToOne(() => SkincareProduct, (product) => product.productId)
  @JoinColumn({ name: 'product_id' })
  product: SkincareProduct

  @Column({ type: 'date' })
  productionDate: Date

  @Column({ type: 'date' })
  expirationDate: Date

  @Column()
  quantity: number
}
