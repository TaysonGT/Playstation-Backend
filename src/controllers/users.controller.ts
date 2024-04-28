import {Response, Request} from "express"
import { myDataSource } from "../app-data-source";
import { User } from "../entity/user.entity";
import { addUserDto } from "../dto/add-user.dto";
import jwt from "jsonwebtoken";

const userRepo = myDataSource.getRepository(User)

const addUser = async (req: Request, res: Response)=>{
    const {username, password, role} = req.body
    if(username && password){
        let admin = null
        role == "admin" ? admin=true: admin=false;

        const userData:addUserDto = {username, password, admin} 
        const user =  userRepo.create(userData)
        const results = await userRepo.save(user)
        res.json({results, message: "تمت إضافة المستخدم بنجاح", success: true})
    }else res.json({message: "برجاء ادخال بيانات صحيحة", success: false})
    
}

const deleteUser = async (req: Request, res: Response)=>{
    const {id} = req.body;
    const user = await userRepo.findOne({where:{id}})
    if(user){
        const results = await userRepo.remove(user)
        res.json({results, message: "تمت إزالة المستخدم بنجاح"})
    }else{
        res.json({message: "هذا الحساب غير موجود"})
    }
}

const updateUser = async (req: Request, res:Response)=>{
    const {id, username, password, role} = req.body
    const user = await userRepo.findOne({where:{id}})
    if(user){
        let admin = null
        role == "admin" ? admin=true: admin=false;

        const userData:addUserDto = {username, password, admin}
        const updatedUser = Object.assign(user, userData)
        const updated = await userRepo.save(updatedUser)
        res.json({success: true, updated, message: "تم تعديل الحساب"})
    }else{
        res.json({success: false, message: "حدث خطأ"})
    }
}

const userLogin = async (req: Request, res: Response)=>{
    const {username, password} = req.body;
    const user = await userRepo.createQueryBuilder("users")
        .where("LOWER(users.username) LIKE LOWER(:query)", { query: `%${username.toLowerCase()}%` })
        .getOne();

    if(user){
        if(user.password==password){
            
            const token = jwt.sign( {username}, "tayson", { expiresIn: '8h' })
            
            return res.json({ messsage: "تم تسجيل الدخول بنجاح ", success: true, token, username: user.username, expDate: Date.now() + 8 *60*60 * 1000})
 
        }else{
            return res.json({message: "كلمة السر خطأ", success: false})
        }
    }else{
        return res.json({message:"مستخدم غير موجود", success: false})
    }
}

const allUsers = async (req: Request, res: Response)=>{
    const users = await userRepo.find()
    if(users.length>0){
        res.json({message: "هناك مستخدم موجود بالفعل", existing: true})
    }else res.json({existing: false, message: "لا يوجد مستخدمين"})
}

export {
    deleteUser,
    addUser,
    userLogin,
    updateUser,
    allUsers
}