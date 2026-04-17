import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

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

export const isAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = req.user

  console.log(user)

  if(!user){
    res.status(401).json({ message: "برجاء تسجيل الدخول", success: false });
    return;
  }

  if(user.role!=='admin') {
    res.status(401).json({success: false,  message: "هذا المستخدم لا يملك الصلاحيات لفعل هذا الأمر"})
    return;
  }

  next()
}
