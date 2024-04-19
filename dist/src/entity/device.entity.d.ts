import { Game } from "./game.entity";
export declare class Device {
    id: number;
    name: string;
    type: string;
    status: boolean;
    games: Game[];
}
