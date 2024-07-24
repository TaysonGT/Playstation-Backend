import { Response, Request } from "express";
declare const statisticFinances: (req: Request, res: Response) => Promise<void>;
declare const addDeduction: (req: Request, res: Response) => Promise<void>;
declare const removeDeduction: (req: Request, res: Response) => Promise<void>;
declare const getUsersFinances: (req: Request, res: Response) => Promise<void>;
declare const allFinances: (req: Request, res: Response) => Promise<void>;
export { addDeduction, removeDeduction, allFinances, getUsersFinances, statisticFinances, };
