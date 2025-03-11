import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { OrderDetail } from "./OrderDetail";

@Entity()
export class ReturnOrderDetail {
    @PrimaryGeneratedColumn()
    returnOrderDetailId: number;

    @ManyToOne(() => OrderDetail, order => order.order)
    @JoinColumn({ name: 'order_id' })
    order: OrderDetail;

    @ManyToOne(() => OrderDetail, detail => detail.orderDetailId)
    @JoinColumn({ name: 'order_detail_id' })
    orderDetail: OrderDetail;

    @Column()
    quantity: number;
}
