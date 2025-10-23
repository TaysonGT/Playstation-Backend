import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, OneToMany } from "typeorm";
import { User } from "./user.entity";
import { Deduction } from "./deduction.entity";

@Entity('deduction_types')
export class DeductionType{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    name: string;

    @Column()
    valueType: 'fixed'|'percentage';

    @Column()
    value: number;
    
    @Column({nullable: true})
    description?: string;

    @Column()
    active: boolean;

    @Column()
    max_amount: number;
    
    @CreateDateColumn()
    created_at: Date;

    @OneToMany(()=>Deduction, (deduction)=>deduction.deductionType)
    deductions: Deduction[];

    @ManyToOne(()=>User, (user)=>user.createdDeductionTypes)
    created_by: User;
} 