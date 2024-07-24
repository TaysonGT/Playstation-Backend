import { Response, Request } from "express";
declare const saveConfigs: (req: Request, res: Response) => Promise<void>;
declare const getConfigs: (req: Request, res: Response) => Promise<void>;
export { saveConfigs, getConfigs };
