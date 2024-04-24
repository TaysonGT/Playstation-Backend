import { Response, Request } from "express";
declare const findDeviceSession: (req: Request, res: Response) => Promise<void>;
declare const changeTime: (req: Request, res: Response) => Promise<void>;
declare const allDeviceSessions: (req: Request, res: Response) => Promise<void>;
declare const addDeviceSession: (req: Request, res: Response) => Promise<void>;
declare const endDeviceSession: (req: Request, res: Response) => Promise<void>;
export { findDeviceSession, changeTime, allDeviceSessions, addDeviceSession, endDeviceSession, };
