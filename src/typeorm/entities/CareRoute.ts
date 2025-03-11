import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn } from "typeorm";
import { User } from "./User";
import { CareRouteDetail } from "./CareRouteDetail";

@Entity()
export class CareRoute {
    @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.skincareRoutines, { eager: true })
  user: User;

  @Column()
  skinType: string; // Example: "Oily", "Dry", "Combination"

  @Column({ type: 'text' })
  concerns: string; // Example: "Acne, Wrinkles"

  @Column({ type: 'json' })
  morningRoutine: string[]; // Example: ["Cleanser", "Toner", "Moisturizer", "Sunscreen"]

  @Column({ type: 'json' })
  eveningRoutine: string[]; // Example: ["Makeup Remover", "Cleanser", "Serum", "Night Cream"]

  @Column({ type: 'json' })
  recommendedProducts: string[]; // Example: ["Hyaluronic Acid Serum", "SPF 50 Sunscreen"]

  @CreateDateColumn()
  createdAt: Date;
}
