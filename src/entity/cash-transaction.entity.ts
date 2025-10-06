import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, OneToOne } from "typeorm";
import { User } from "./user.entity";
import { CashCollection } from "./cash-collection.entity";

@Entity('cash_transactions')
export class CashTransaction{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    amount: number;
    
    @Column({nullable: true})
    description?: string;

    @Column()
    type: 'collection'|'replineshment';
    
    @ManyToOne(()=>User, (user)=>user.cashTransactions)
    cashier: User;
    
    @OneToOne(()=>CashCollection, (collection)=>collection.transaction)
    collection: User;

    @CreateDateColumn()
    timestamp: Date;
} 