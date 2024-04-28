import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('device_type')
export class DeviceType{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    name: string;

    @Column()
    single_price: number;

    @Column()
    multi_price: number;
} 