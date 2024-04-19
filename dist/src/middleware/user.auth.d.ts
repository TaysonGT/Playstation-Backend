import { Request, Response, NextFunction } from 'express';
export declare const auth: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
export declare const isSigned: (req: Request, res: Response, next: NextFunction) => Promise<void>;
