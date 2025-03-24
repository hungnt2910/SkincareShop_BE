import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm'
import { User } from './User'
import { ReturnOrderDetail } from './ReturnOrderDetail'
import { OrderDetail } from './OrderDetail'
@Entity()
export class Orders {
  @PrimaryGeneratedColumn()
  orderId: number

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  customer: User

  @Column()
  status: string

  @Column('float')
  amount: number

  @Column()
  shippingAddress: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date

  @Column()
  receiverName: string

  @Column()
  phoneNumber: string

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  orderDetails: OrderDetail[]

  @OneToMany(() => ReturnOrderDetail, (returnDetail) => returnDetail.order)
  returnDetails: ReturnOrderDetail[]
}
