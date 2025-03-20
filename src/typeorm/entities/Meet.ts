import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Meet {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true })
  link: string;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, (staff) => staff.id, { nullable: true })
  @JoinColumn({ name: 'staff_id' })
  staff?: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
