import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../entity/user.entity';
import { myDataSource } from '../app-data-source';

const userRepo = myDataSource.getRepository(User)

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
        username: string;
    };
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]
    if(!token){ 
        res.json({success: false, message: "You're not signed in"})
        return;
    }
    const verify = jwt.verify(token, "tayson")
    if(verify){
      req.user = {
        id: (verify as any).user_id,
        role: (verify as any).role,
        username: (verify as any).username
      }
      next()
    } else res.json({message: "Invalid Session! Please Logout and Sign In again...", success: false})
}

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.toString().split(' ')[1];  
  if(!token) {
    res.json({ message: "ليست هناك جلسة", success: false });
    return;
  }

  const decoded:any = jwt.verify(token, 'tayson')

  const user = await userRepo.findOne({where:{id: decoded.user_id}});

  if (!user) {
    res.json({ message: "هذا المستخدمم غير موجود", success: false });
    return;
  }

  user&& user.role !=='admin'? res.json({success: false,  message: "هذا المستخدم لا يملك الصلاحيات لفعل هذا الأمر"}) : next()
}
