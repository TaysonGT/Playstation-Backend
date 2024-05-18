import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity('time_receipt')
export class TimeReceipt{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    session_id: string

    @CreateDateColumn({default: Date.now()})
    end_at: Date
    
    @Column()
    orders: string

    @Column()
    time_orders: string

    @Column()
    total: number

    @Column()
    cashier: string
    
    @Column()
    cashier_id: string
}