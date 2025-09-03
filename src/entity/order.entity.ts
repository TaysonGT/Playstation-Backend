import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne} from "typeorm";
import { Session } from "./session.entity";
import { Product } from "./product.entity";
import { Receipt } from "./reciept.entity";

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    quantity: number;
    
    @Column()
    cost:number
    
    @ManyToOne(()=>Product, (product)=>product.orders)
    product: Product;
    
    @ManyToOne(()=>Session, (session)=>session.orders)
    session?: Session;

    @ManyToOne(()=>Receipt, (receipt)=>receipt.orders)
    receipt: Receipt;

    @CreateDateColumn()
    ordered_at: string;
}