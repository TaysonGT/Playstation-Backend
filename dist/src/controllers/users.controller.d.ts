import { Response, Request } from "express";
declare const addUser: (req: Request, res: Response) => Promise<void>;
declare const findUser: (req: Request, res: Response) => Promise<void>;
declare const deleteUser: (req: Request, res: Response) => Promise<void>;
declare const updateUser: (req: Request, res: Response) => Promise<void>;
declare const userLogin: (req: Request, res: Response) => Promise<void>;
declare const allUsers: (req: Request, res: Response) => Promise<void>;
declare const checkUsers: (req: Request, res: Response) => Promise<void>;
export { deleteUser, addUser, userLogin, updateUser, allUsers, findUser, checkUsers };
