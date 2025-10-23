import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne } from "typeorm";
import { Receipt } from "./reciept.entity";
import { DeductionType } from "./deduction-type.entity";

@Entity('deductions')
export class Deduction{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @ManyToOne(()=>DeductionType, (type)=>type.deductions)
    deductionType: DeductionType;
    
    @OneToOne(()=>Receipt, (receipt)=>receipt.deduction)
    receipt: Receipt;
} 