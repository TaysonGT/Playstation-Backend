import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Receipt } from "./reciept.entity";
import { CashCollection } from "./cash-collection.entity";
import { DeductionType } from "./deduction-type.entity";

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

    @OneToMany(()=>DeductionType, (deductionTypes)=> deductionTypes.created_by)
    createdDeductionTypes: DeductionType[];

    @OneToMany(()=>CashCollection, (cashCollection)=> cashCollection.collected_by)
    cashCollections: CashCollection[];
}