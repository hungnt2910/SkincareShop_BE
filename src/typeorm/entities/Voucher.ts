import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UserVoucher } from "./UserVoucher";

@Entity()
export class Voucher {
    @PrimaryGeneratedColumn()
    voucherId: number;

    @Column()
    code: string;

    @Column("float")
    discount: number;

    @Column({ type: "timestamp" })
    expirationDate: Date;

    @OneToMany(() => UserVoucher, uv => uv.voucher)
    userVouchers: UserVoucher[];
}
