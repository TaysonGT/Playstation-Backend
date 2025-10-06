import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { CashTransaction } from "./cash-transaction.entity";

@Entity('cash_collections')
export class CashCollection{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    current_balance: number;

    @ManyToOne(()=>CashTransaction, (transaction)=>transaction.collection)
    @JoinColumn({ name: 'transaction_id' ,  referencedColumnName: 'id'})
    transaction: CashTransaction;
} 