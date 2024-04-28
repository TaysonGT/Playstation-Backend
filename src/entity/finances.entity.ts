import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn} from "typeorm";

@Entity('finances')
export class Finance {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    finances: number;

    @Column()
    type: string;

    @Column()
    description: string;

    @Column()
    username: string;

    @CreateDateColumn({name: 'added_at'})
    added_at: string;
}