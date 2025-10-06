import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('cash_assignments')
export class CashAssignment{
    @PrimaryGeneratedColumn('uuid')
    id:string;
    
    @Column({default: 0})
    openning_balance: number;

    @Column({default: 0})
    closing_balance: number;

    @Column({default: 'active'})
    status: 'active'|'completed';
    
    @ManyToOne(()=>User, (user)=>user.cashAssignments)
    cashier: User;

    @CreateDateColumn()
    timestamp: Date;
} 