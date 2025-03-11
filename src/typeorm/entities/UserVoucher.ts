import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import { Voucher } from "./Voucher";

@Entity()
export class UserVoucher {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.userVouchers)
    user: User;

    @ManyToOne(() => Voucher, voucher => voucher.userVouchers)
    voucher: Voucher;

    @Column({ default: false })
    used: boolean;
}
