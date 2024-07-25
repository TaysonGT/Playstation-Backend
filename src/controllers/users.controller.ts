import { Response, Request } from "express"
import { myDataSource } from "../app-data-source";
import { User } from "../entity/user.entity";
import jwt from "jsonwebtoken";

const userRepo = myDataSource.getRepository(User)

const addUser = async (req: Request, res: Response) => {
  const { username, password, admin } = req.body;
  if (username && password) {
    const trimmedPass = password.trim();
    const trimmedUser = username.trim();
    let role = null;
    const user = await userRepo.createQueryBuilder("users")
      .where("LOWER(users.username) = LOWER(:query)", {
        query:
          `${trimmedUser}`
      })
      .getOne();
    const users = await userRepo.find();
    if (users.length < 1) {
      role = true;
    }
    else {
      admin ? role = true : role = false;
    }
    if (trimmedPass.length < 6) {
      res.json({ message: "كلمة السر يجب ان تتكون من 6 حروف على الاقل", success: false });
    }
    else if (user) {
      res.json({ message: "هذا المستخدم موجود بالفعل", success: false });
    }
    else {
      const userData = { username: trimmedUser, password: trimmedPass, admin: role };
      const user = userRepo.create(userData);
      const results = await userRepo.save(user);
      res.json({ results, message: "تمت إضافة المستخدم بنجاح", success: true });
    }
  }
  else
    res.json({ message: "برجاء ادخال جميع البيانات", success: false });
}

const findUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userRepo.findOne({ where: { id } });
  user ? res.json({ user }) : res.json({ message: "هذا المستخدم غير موجود", success: false });
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
  const { id, username, password, admin } = req.body;
  const user = await userRepo.findOne({ where: { id } });
  const users = await userRepo.find();
  if (user) {
    let role = null;
    admin ? role = true : role = false;
    if (users.length < 2 && role == false) {
      res.json({ message: "يجب ان يكون هناك مستخدم واحد مسؤول على الأقل", success: false });
    } else if (password.length < 6) {
      res.json({ message: "كلمة السر يجب ان تتكون من 6 حروف على الاقل", success: false });
    } else {
      const userData = { username, password, admin };
      const updatedUser = Object.assign(user, userData);
      const updated = await userRepo.save(updatedUser);
      res.json({ success: true, updated, message: "تم تعديل الحساب" });
    }
  }
  else res.json({ success: false, message: "حدث خطأ" });
}

const userLogin = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const trimmedPass:string = password.trim();
  const trimmedUser:string = username.trim();
  const user = await userRepo.createQueryBuilder("users")
    .where("LOWER(users.username) = LOWER(:query)", { query: `${trimmedUser}` })
    .getOne();

  if (user) {
    console.log(user.password, trimmedPass)
    if (user.password == trimmedPass) {
      const token = jwt.sign({ trimmedUser }, "tayson", { expiresIn: '8h' })
      res.json({ messsage: "تم تسجيل الدخول بنجاح ", success: true, token,
      username: user.username, user_id: user.id, expDate: Date.now() + 8 * 60 * 60 * 1000 })
    } else {
      res.json({ message: "كلمة السر خطأ", success: false })
    }
  } else {
    res.json({ message: "مستخدم غير موجود", success: false })
  }
}

const allUsers = async (req: Request, res: Response) => {
  const users = await userRepo.find()
  res.json({ users })
}

const checkUsers = async (req: Request, res: Response) => {
  const users = await userRepo.find();
  if (users.length > 0) {
    res.json({ message: "هناك مستخدم موجود بالفعل", existing: true });
  }else
    res.json({ existing: false, message: "لا يوجد مستخدمين" });
}

export {
  deleteUser,
  addUser,
  userLogin,
  updateUser,
  allUsers,
  findUser,
  checkUsers
}