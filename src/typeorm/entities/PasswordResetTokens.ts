import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './User'

@Entity()
export class PasswordResetTokens {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, (user) => user.passwordResetTokens)
  user: User

  @Column()
  token: string

  @Column()
  expiredAt: Date
}
