import { Column, PrimaryGeneratedColumn } from 'typeorm'

export class LoyaltyPoints {
  @PrimaryGeneratedColumn()
  loyaltyPointsId: number

  @Column()
  userId: number

  @Column()
  points: number
}
