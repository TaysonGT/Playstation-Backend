import { Entity, Column, PrimaryGeneratedColumn, OneToMany, DeleteDateColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity('products')
export class Product{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    price: number

    @Column()
    stock: number

    @OneToMany(()=>Order, (order)=>order.product)
    orders: Order[];

    @DeleteDateColumn()
    deletedAt: Date;
}
