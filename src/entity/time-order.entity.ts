import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne} from "typeorm";
import { Session } from "./session.entity";
import { Receipt } from "./reciept.entity";
import { Device } from "./device.entity";

@Entity('time_orders')
export class TimeOrder {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(()=>Session, (session)=>session.time_orders)
    session: Session;
    
    @ManyToOne(()=>Device, (device)=>device.timeOrders)
    device: Device;

    @ManyToOne(()=>Receipt, (receipt)=>receipt.time_orders)
    receipt: Receipt;

    @Column()
    play_type:string;

    @Column()
    cost: number

    @Column()
    started_at: Date;

    @CreateDateColumn()
    ended_at: Date;
}