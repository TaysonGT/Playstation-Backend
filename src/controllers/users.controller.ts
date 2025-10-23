import { Response, Request } from "express"
import { myDataSource } from "../app-data-source";
import { User } from "../entity/user.entity";
import jwt from "jsonwebtoken";
import { addUserDto } from "../dto/add-user.dto";

const userRepo = myDataSource.getRepository(User)

const addUser = async (req: Request, res: Response) => {
  const { username, password, role } = req.body;
  if (!(username && password)) {
    res.json({ message: "برجاء ادخال جميع البيانات", success: false });
    return;
  }

  const trimmedPass = password.trim();
  const trimmedUser = username.trim();
  
  const existingUser = await userRepo.createQueryBuilder("users")
    .where("LOWER(users.username) = LOWER(:query)", {
      query:
        `${trimmedUser}`
    })
    .getOne();
  if (trimmedPass.length < 6) {
    res.json({ message: "كلمة السر يجب ان تتكون من 6 حروف على الاقل", success: false });
    return
  }
  if (existingUser) {
    res.json({ message: "هذا المستخدم موجود بالفعل", success: false });
    return
  }
  
  const users = await userRepo.find();

  const user = userRepo.create({ username: trimmedUser, password: trimmedPass, role: users.length===0? 'admin' : role });
  const results = await userRepo.save(user);
  const token = jwt.sign({ user_id: user.id, username: user.username }, "tayson", { expiresIn: '8h' })

  res.json({ 
    results, message: "تمت إضافة المستخدم بنجاح", 
    success: true,
    token,
    expDate: Date.now() + 8 * 60 * 60 * 1000 
  })
}

const findUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userRepo.findOne({ where: { id } });
  user ? res.json({ user, success:true }) : res.json({ message: "هذا المستخدم غير موجود", success: false });
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const users = await userRepo.find();
  const user = await userRepo.findOne({ where: { id } });
  if (users.length < 2) {
    res.json({ message: "لا يوجد مستخدمين آخرين ", success: false });
  } else if (user) {
    const results = await userRepo.remove(user);
    res.json({ results, message: "تمت إزالة المستخدم بنجاح", success: true });
  } else {
    res.json({ message: "هذا الحساب غير موجود", success: false });
  }
}

const updateUser = async (req: Request, res: Response) => {
  const { id, username, password, role } = req.body as addUserDto;
  if (password?.length < 6) {
    res.json({ message: "كلمة السر يجب ان تتكون من 6 حروف على الاقل", success: false });
    return;
  }

  const user = await userRepo.findOne({ where: { id } });
  
  if (!user) {
    res.json({ success: false, message: "حدث خطأ" });
    return;
  }
  
  if (!password && !username && user.role === role && password?.trim()===user.password && username?.toLowerCase().trim() === user.username){
    res.json({ message: "لم يتم إدخال أي بيانات", success: false });
  }

  const admins = await userRepo.find({where: {role: 'admin'}});

  if (admins.length === 1 && role === 'employee') {
    res.json({ message: "يجب ان يكون هناك مستخدم واحد مسؤول على الأقل", success: false });
    return
  }
  const userData = { username, password, role };
  const updatedUser = Object.assign(user, userData);
  const updated = await userRepo.save(updatedUser);
  res.json({ success: true, updated, message: "تم تعديل الحساب" });
}

const userLogin = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const trimmedPass:string = password.trim();
  const trimmedUser:string = username.trim();
  
  if (!trimmedUser) {
    res.json({ message: "برجاء إدخال اسم المستخدم", success: false })
    return
  }
  if (!trimmedPass) {
    res.json({ message: "برجاء إدخال كلمة المرور", success: false })
    return
  }
  
  const user = await userRepo.createQueryBuilder("users")
  .where("LOWER(users.username) = LOWER(:query)", { query: `${trimmedUser}` })
    .getOne();
    
  if (!user) {
    res.json({ message: "مستخدم غير موجود", success: false })
    return
  }
  if (user.password !== trimmedPass) {
    res.json({ message: "كلمة السر خطأ", success: false })
    return;
  }

  const token = jwt.sign({ user_id: user.id, username: user.username }, "tayson", { expiresIn: '8h' })
  res.json({ 
    message: "تم تسجيل الدخول بنجاح ", 
    success: true, 
    token,
    expDate: Date.now() + 8 * 60 * 60 * 1000 
  })
  
}

const allUsers = async (req: Request, res: Response) => {
  const users = await userRepo.find()
  res.json({ users, success: true })
}

const checkUsers = async (req: Request, res: Response) => {
  const users = await userRepo.find();
  if (users.length > 0) {
    res.json({ message: "يوجد مستخدم موجود بالفعل", success: false });
  }else
    res.json({ success: true, message: "لا يوجد مستخدمين" });
}

const currentSession = async (req: Request, res: Response) => {
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
  const {password, ...safeUser} = user

  res.json({ success: true, user: safeUser });
}

export {
  deleteUser,
  currentSession,
  addUser,
  userLogin,
  updateUser,
  allUsers,
  findUser,
  checkUsers
}