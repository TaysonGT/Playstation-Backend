import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../entity/user.entity';
import { myDataSource } from '../app-data-source';

const userRepo = myDataSource.getRepository(User)

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.toString().split(' ')[1]
    if(token){ 
        const verify = jwt.verify(token, "tayson")
        verify? next() : res.json({message: "Invalid Session! Please Logout and Sign In again...", success: false})
    }else{
        res.json({success: false, message: "You're not signed in"})
    }
}

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.headers.user_id?.toString().split(' ')[1]
  const user = await userRepo.findOne({where: {id}})
  user&& !user.admin? res.json({success: false,  message: "هذا المستخدم لا يملك الصلاحيات لفعل هذا الأمر"}) : next()
}
