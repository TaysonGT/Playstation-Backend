import { Response, Request } from "express";
declare const allGames: (req: Request, res: Response) => Promise<void>;
declare const addGame: (req: Request, res: Response) => Promise<void>;
declare const deleteGame: (req: Request, res: Response) => Promise<void>;
export { allGames, addGame, deleteGame };
