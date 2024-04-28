import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

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

    @Column()
    consumed: number
}