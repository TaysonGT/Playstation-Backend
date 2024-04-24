import { Request, Response, NextFunction } from 'express';
export declare const auth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const addAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const isSigned: (req: Request, res: Response, next: NextFunction) => Promise<void>;
