import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from 'typeorm'
import { UserVoucher } from './UserVoucher'

@Entity()
export class Voucher {
  @PrimaryGeneratedColumn()
  voucherId: number

  @Column({ unique: true })
  code: string

  @Column('float')
  discount: number

  @Column({ type: 'timestamp' })
  expirationDate: Date

  @OneToMany(() => UserVoucher, (uv) => uv.voucher)
  userVouchers: UserVoucher[]
}
