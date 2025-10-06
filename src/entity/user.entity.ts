import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Receipt } from "./reciept.entity";
import { CashAssignment } from "./cash-assignment.entity";
import { CashTransaction } from "./cash-transaction.entity";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column({default: false})
    role: 'admin'|'employee';

    @OneToMany(()=>Receipt, (receipt)=> receipt.cashier)
    receipts: Receipt[];

    @OneToMany(()=>CashAssignment, (session)=> session.cashier)
    cashAssignments: CashAssignment[];
    
    @OneToMany(()=>CashTransaction, (transaction)=> transaction.cashier)
    cashTransactions: CashTransaction[];
}