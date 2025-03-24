import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm'
import { Role } from './Role'
import { Orders } from './Order'
import { Reviews } from './Reviews'
import { Blogs } from './Blogs'
import { UserVoucher } from './UserVoucher'
import { CareRoute } from './CareRoute'
import { PasswordResetTokens } from './PasswordResetTokens'

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column()
  username: string

  @Column()
  password: string

  @Column({ nullable: true })
  phone: string

  @Column({ nullable: true })
  address: string

  @Column({ nullable: true })
  email: string

  @Column({ default: true })
  status: boolean

  @ManyToOne(() => Role, (role) => role.users, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role: Role

  @OneToMany(() => Orders, (order) => order.customer)
  orders: Orders[]

  @OneToMany(() => Reviews, (reviews) => reviews.user)
  reviews: Reviews[]

  @OneToMany(() => Blogs, (blog) => blog.user)
  blogs: Blogs[]

  @OneToMany(() => UserVoucher, (uv) => uv.user)
  userVouchers: UserVoucher[]

  @OneToMany(() => CareRoute, (routine) => routine.user)
  skincareRoutines: CareRoute[]

  @OneToMany(() => PasswordResetTokens, (token) => token.user)
  passwordResetTokens: PasswordResetTokens[]
}
