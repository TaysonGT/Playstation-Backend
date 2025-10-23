import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('cash_collections')
export class CashCollection{
    @PrimaryGeneratedColumn('uuid')
    id:string;    
    
    @Column()
    starting_float_amount: number;
        
    @Column()
    cash_counted: number

    @Column()
    expected_cash: number

    @Column()
    cash_over_short:  number;

    @Column()
    amount_collected: number

    @Column()
    float_remaining: number
    
    @Column()
    notes: string;
    
    @CreateDateColumn()
    timestamp: Date
    
    @ManyToOne(()=>User, (user)=>user.cashCollections)
    collected_by: User;
} 