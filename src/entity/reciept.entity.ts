import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { User } from "./user.entity";
import { TimeOrder } from "./time-order.entity";
import { Order } from "./order.entity";
import { Device } from "./device.entity";
import { Deduction } from "./deduction.entity";

@Entity('receipts')
export class Receipt{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    type: 'session'|'outer';

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

    @OneToOne(()=>Deduction, (deduction)=>deduction.receipt)
    deduction: Deduction;
    
    @ManyToOne(()=>User, (user)=>user.receipts)
    cashier: User;
    
    @CreateDateColumn()
    created_at: Date
}