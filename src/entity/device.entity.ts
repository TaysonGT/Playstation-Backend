import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne, OneToMany } from "typeorm";
import { Session } from "./session.entity";
import { DeviceType } from "./device-type.entity";
import { Receipt } from "./reciept.entity";

@Entity('devices')
export class Device{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    name: string;

    @Column({default: false})
    status: boolean;
    
    @ManyToOne(()=>DeviceType, (deviceType)=>deviceType.devices)
    type: DeviceType;

    @OneToMany(()=>Receipt, (receipt)=>receipt.device)
    receipts: Receipt[];

    @OneToOne(()=>Session, (session)=> session.device)
    session?: Session;
} 