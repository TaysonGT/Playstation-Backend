import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('devices')
export class Device{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    name: string;

    @Column()
    type: string

    @Column({default: false})
    status: boolean;

} 