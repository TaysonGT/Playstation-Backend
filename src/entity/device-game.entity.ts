import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('device_games')
export class DeviceGame{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    device_id: string;

    @Column()
    game_id: string;
}