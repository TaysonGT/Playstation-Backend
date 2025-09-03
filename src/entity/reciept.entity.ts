import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "./user.entity";
import { TimeOrder } from "./time-order.entity";
import { Order } from "./order.entity";
import { Device } from "./device.entity";

@Entity('receipts')
export class Receipt{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    type: 'session'|'outer'|'deduction';

    @Column({nullable: true})
    description?: string;

    @Column()
    total: number;
    
    @OneToMany(()=>Order, (order)=>order.receipt)
    orders: Order[];

    @ManyToOne(()=>Device, (device)=>device.receipts)
    device: Device

    @OneToMany(()=>TimeOrder, (order)=>order.receipt)
    time_orders: TimeOrder[];
    
    @ManyToOne(()=>User, (user)=>user.receipts)
    cashier: User;
    
    @CreateDateColumn()
    created_at: Date
}