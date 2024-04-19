import { Response, Request, NextFunction } from "express";
declare const findUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const addUser: (req: Request, res: Response) => Promise<void>;
declare const deleteUser: (req: Request, res: Response) => Promise<void>;
declare const userLogin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const userLogout: (req: Request, res: Response) => Promise<void>;
export { deleteUser, addUser, userLogin, findUser, userLogout };
