import { Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity('games')
export class Game{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;
}