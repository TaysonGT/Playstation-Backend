import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from "typeorm";
import { Order } from './order.entity';

@Entity('sessions')
export class Session {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    device_id: string;

    @CreateDateColumn()
    start_at: string;

    @Column({name: "end_at", nullable:true})
    end_at: string;

    @Column('text')
    time_type: string;

    @Column('text')
    play_type: string;

    @OneToMany(()=>Order, order => order.device_session_id)
    orders?: Order[];

} 