"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUsers = exports.findUser = exports.allUsers = exports.updateUser = exports.userLogin = exports.addUser = exports.deleteUser = void 0;
const tslib_1 = require("tslib");
const app_data_source_1 = require("../app-data-source");
const user_entity_1 = require("../entity/user.entity");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const userRepo = app_data_source_1.myDataSource.getRepository(user_entity_1.User);
const addUser = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { username, password, admin } = req.body;
    if (username && password) {
        const trimmedPass = password.trim();
        const trimmedUser = username.trim();
        let role = null;
        const user = yield userRepo.createQueryBuilder("users")
            .where("LOWER(users.username) = LOWER(:query)", {
            query: `${trimmedUser}`
        })
            .getOne();
        const users = yield userRepo.find();
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
            const results = yield userRepo.save(user);
            res.json({ results, message: "تمت إضافة المستخدم بنجاح", success: true });
        }
    }
    else
        res.json({ message: "برجاء ادخال جميع البيانات", success: false });
});
exports.addUser = addUser;
const findUser = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield userRepo.findOne({ where: { id } });
    user ? res.json({ user }) : res.json({ message: "هذا المستخدم غير موجود", success: false });
});
exports.findUser = findUser;
const deleteUser = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const users = yield userRepo.find();
    const user = yield userRepo.findOne({ where: { id } });
    if (users.length < 2) {
        res.json({ message: "لا يوجد مستخدمين آخرين ", success: false });
    }
    else if (user) {
        const results = yield userRepo.remove(user);
        res.json({ results, message: "تمت إزالة المستخدم بنجاح", success: true });
    }
    else {
        res.json({ message: "هذا الحساب غير موجود", success: false });
    }
});
exports.deleteUser = deleteUser;
const updateUser = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id, username, password, admin } = req.body;
    const user = yield userRepo.findOne({ where: { id } });
    const users = yield userRepo.find();
    if (user) {
        let role = null;
        admin ? role = true : role = false;
        if (users.length < 2 && role == false) {
            res.json({ message: "يجب ان يكون هناك مستخدم واحد مسؤول على الأقل", success: false });
        }
        else if (password.length < 6) {
            res.json({ message: "كلمة السر يجب ان تتكون من 6 حروف على الاقل", success: false });
        }
        else {
            const userData = { username, password, admin };
            const updatedUser = Object.assign(user, userData);
            const updated = yield userRepo.save(updatedUser);
            res.json({ success: true, updated, message: "تم تعديل الحساب" });
        }
    }
    else
        res.json({ success: false, message: "حدث خطأ" });
});
exports.updateUser = updateUser;
const userLogin = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const trimmedPass = password.trim();
    const trimmedUser = username.trim();
    const user = yield userRepo.createQueryBuilder("users")
        .where("LOWER(users.username) = LOWER(:query)", { query: `${trimmedUser}` })
        .getOne();
    if (user) {
        console.log(user.password, trimmedPass);
        if (user.password == trimmedPass) {
            const token = jsonwebtoken_1.default.sign({ trimmedUser }, "tayson", { expiresIn: '8h' });
            res.json({ messsage: "تم تسجيل الدخول بنجاح ", success: true, token,
                username: user.username, user_id: user.id, expDate: Date.now() + 8 * 60 * 60 * 1000 });
        }
        else {
            res.json({ message: "كلمة السر خطأ", success: false });
        }
    }
    else {
        res.json({ message: "مستخدم غير موجود", success: false });
    }
});
exports.userLogin = userLogin;
const allUsers = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const users = yield userRepo.find();
    res.json({ users });
});
exports.allUsers = allUsers;
const checkUsers = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const users = yield userRepo.find();
    if (users.length > 0) {
        res.json({ message: "هناك مستخدم موجود بالفعل", existing: true });
    }
    else
        res.json({ existing: false, message: "لا يوجد مستخدمين" });
});
exports.checkUsers = checkUsers;
//# sourceMappingURL=users.controller.js.map