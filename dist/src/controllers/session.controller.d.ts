import { Response, Request } from "express";
declare const findSession: (req: Request, res: Response) => Promise<void>;
declare const changeTime: (req: Request, res: Response) => Promise<void>;
declare const allSessions: (req: Request, res: Response) => Promise<void>;
declare const addSession: (req: Request, res: Response) => Promise<void>;
declare const endSession: (req: Request, res: Response) => Promise<void>;
export { findSession, changeTime, allSessions, addSession, endSession, };
