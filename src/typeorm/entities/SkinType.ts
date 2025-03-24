import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm'
import { SkinTypeDetails } from './SkinTypeDetails'
import { SkincareProduct } from './SkincareProduct'

@Entity()
export class SkinType {
  @PrimaryGeneratedColumn()
  skinTypeId: number

  @Column()
  type: string

  @ManyToMany(() => SkincareProduct, (product) => product.skinTypes)
  products: SkincareProduct[]
}
