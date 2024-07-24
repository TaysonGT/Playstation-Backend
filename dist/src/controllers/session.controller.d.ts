import { Response, Request } from "express";
declare const findSession: (req: Request, res: Response) => Promise<void>;
declare const changeDevice: (req: Request, res: Response) => Promise<void>;
declare const changePlayType: (req: Request, res: Response) => Promise<void>;
declare const allSessions: (req: Request, res: Response) => Promise<void>;
declare const addSession: (req: Request, res: Response) => Promise<void>;
declare const endSession: (req: Request, res: Response) => Promise<void>;
export { findSession, changePlayType, changeDevice, allSessions, addSession, endSession, };
