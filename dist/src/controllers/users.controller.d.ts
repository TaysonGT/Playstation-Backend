import { Response, Request } from "express";
declare const addUser: (req: Request, res: Response) => Promise<void>;
declare const deleteUser: (req: Request, res: Response) => Promise<void>;
declare const updateUser: (req: Request, res: Response) => Promise<void>;
declare const userLogin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const allUsers: (req: Request, res: Response) => Promise<void>;
export { deleteUser, addUser, userLogin, updateUser, allUsers };
