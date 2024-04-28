import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../entity/user.entity';
import { myDataSource } from '../app-data-source';

const userRepo = myDataSource.getRepository(User)

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.access_token
    if(!token){
        res.json({success: false, message: "You're not signed in"})
    }else{ 
        const verify = jwt.verify(token, "tayson")
        verify? next() : res.json({message: "Invalid Session! Please Logout and Sign In again...", success: false})
    }
}

export const addAuth = async (req: Request, res: Response, next: NextFunction) => {
    const users = await userRepo.find()
    users.length>0? res.json({existing: true,  message: "هناك مستخدم بالفعل"}) : next()
}

export const isSigned = async (req: Request, res: Response, next: NextFunction)=>{
    if(req.cookies.access_token){
        res.json({message: "You're Already Signed In", success: false})
    }else{
       next()
    }
}