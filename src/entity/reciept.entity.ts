import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity('receipts')
export class Receipt{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    cashier: string;

    @Column()
    cashier_id: string;
    
    @Column()
    orders: string;

    @CreateDateColumn()
    time_ordered: string

    @Column()
    total: number;
}