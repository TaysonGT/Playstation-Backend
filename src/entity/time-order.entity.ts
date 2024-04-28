import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn} from "typeorm";

@Entity('time_orders')
export class TimeOrder {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    session_id: string

    @Column()
    play_type:string;

    @Column()
    cost: number

    @Column()
    start_at: Date;

    @CreateDateColumn()
    end_at: Date;
}