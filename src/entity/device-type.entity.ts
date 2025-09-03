import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Device } from "./device.entity";

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

    @OneToMany(()=>Device, (device)=>device.type)
    devices: Device[];
} 