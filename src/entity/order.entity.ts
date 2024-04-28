import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from "typeorm";

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    product_id: string;
    
    @Column()
    quantity: number;
    
    @Column()
    cost:number
    
    @Column({nullable: true})
    device_session_id: string;
    
    @Column({nullable: true})
    device_name: string;

    @CreateDateColumn()
    time_ordered: string;
}