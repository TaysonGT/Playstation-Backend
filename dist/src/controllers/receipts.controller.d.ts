import { Response, Request } from "express";
declare const createOuterReceipt: (req: Request, res: Response) => Promise<void>;
declare const allOuterReceipts: (req: Request, res: Response) => Promise<void>;
declare const findOuterReceipt: (req: Request, res: Response) => Promise<void>;
export { createOuterReceipt, allOuterReceipts, findOuterReceipt };
