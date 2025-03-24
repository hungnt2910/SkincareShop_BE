import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
  JoinTable
} from 'typeorm'
import { Category } from './Category'
import { Brand } from './Brand'
import { Reviews } from './Reviews'
import { OrderDetail } from './OrderDetail'
import { SkinType } from './SkinType'

@Entity()
export class SkincareProduct {
  @PrimaryGeneratedColumn()
  productId: number

  @Column()
  productName: string

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category

  @ManyToOne(() => Brand, (brand) => brand.products)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand

  @Column('text')
  description: string

  @Column('float')
  price: number

  @Column({ default: true })
  isActive: boolean

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column()
  stock: number

  @Column({ type: 'text', nullable: true })
  urlImage: string

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.product)
  orderDetails: OrderDetail[]

  @OneToMany(() => Reviews, (review) => review.product)
  reviews: Reviews[]

  @ManyToMany(() => SkinType)
  @JoinTable({
    name: 'skincare_product_skin_type',
    joinColumn: { name: 'product_id', referencedColumnName: 'productId' },
    inverseJoinColumn: { name: 'skin_type_id', referencedColumnName: 'skinTypeId' } // ✅ Use `skinTypeId`
  })
  skinTypes: SkinType[]
}
