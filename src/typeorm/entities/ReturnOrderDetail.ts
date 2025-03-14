import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { Orders } from './Order'
import { SkincareProduct } from './SkincareProduct'

@Entity()
export class ReturnOrderDetail {
  @PrimaryGeneratedColumn()
  returnOrderDetailId: number

  @ManyToOne(() => Orders, (order) => order.returnDetails)
  @JoinColumn({ name: 'order_id' })
  order: Orders

  @ManyToOne(() => SkincareProduct, (product) => product.productId)
  @JoinColumn({ name: 'product_id' })
  product: SkincareProduct

  @Column()
  price: number

  @Column()
  quantity: number
}
