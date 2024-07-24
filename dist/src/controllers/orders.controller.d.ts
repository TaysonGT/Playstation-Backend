import { Response, Request } from "express";
declare const allOrders: (req: Request, res: Response) => Promise<void>;
declare const allOuterOrders: (req: Request, res: Response) => Promise<void>;
declare const sessionOrders: (req: Request, res: Response) => Promise<void>;
declare const addOrder: (req: Request, res: Response) => Promise<void>;
declare const deleteOrder: (req: Request, res: Response) => Promise<void>;
export { allOrders, sessionOrders, allOuterOrders, addOrder, deleteOrder };
