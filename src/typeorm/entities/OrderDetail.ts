import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { Orders } from './Order'
import { SkincareProduct } from './SkincareProduct'

@Entity()
export class OrderDetail {
  @PrimaryGeneratedColumn()
  orderDetailId: number

  @ManyToOne(() => Orders, (order) => order.orderDetails)
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
