import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('head_config')
export class HeadConfig {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    key: string;

    @Column()
    value: string
} 