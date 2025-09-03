import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, OneToOne, JoinColumn } from "typeorm";
import { Order } from './order.entity';
import { Device } from "./device.entity";
import { TimeOrder } from "./time-order.entity";

@Entity('sessions')
export class Session {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable: true})
    device_id?: string;

    @Column({nullable:true})
    ended_at: string;

    @Column('text')
    time_type: string;
    
    @Column('text')
    play_type: string;

    @Column({default: 'running'})
    status: 'ended'|'running';

    @CreateDateColumn()
    started_at: string;

    @OneToOne(()=> Device, (device)=> device.session)
    @JoinColumn({name: 'device_id'})
    device?: Device;

    @OneToMany(()=>Order, order => order.session)
    orders: Order[];

    @OneToMany(()=>TimeOrder, order => order.session)
    time_orders: Order[];
} 