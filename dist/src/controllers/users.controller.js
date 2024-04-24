"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allUsers = exports.updateUser = exports.userLogin = exports.addUser = exports.deleteUser = void 0;
const tslib_1 = require("tslib");
const app_data_source_1 = require("../app-data-source");
const user_entity_1 = require("../entity/user.entity");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const userRepo = app_data_source_1.myDataSource.getRepository(user_entity_1.User);
const addUser = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { username, password, role } = req.body;
    if (username && password) {
        let admin = null;
        role == "admin" ? admin = true : admin = false;
        const userData = { username, password, admin };
        const user = userRepo.create(userData);
        const results = yield userRepo.save(user);
        res.json({ results, message: "تمت إضافة المستخدم بنجاح", success: true });
    }
    else
        res.json({ message: "برجاء ادخال بيانات صحيحة", success: false });
});
exports.addUser = addUser;
const deleteUser = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const user = yield userRepo.findOne({ where: { id } });
    if (user) {
        const results = yield userRepo.remove(user);
        res.json({ results, message: "تمت إزالة المستخدم بنجاح" });
    }
    else {
        res.json({ message: "هذا الحساب غير موجود" });
    }
});
exports.deleteUser = deleteUser;
const updateUser = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id, username, password, role } = req.body;
    const user = yield userRepo.findOne({ where: { id } });
    if (user) {
        let admin = null;
        role == "admin" ? admin = true : admin = false;
        const userData = { username, password, admin };
        const updatedUser = Object.assign(user, userData);
        const updated = yield userRepo.save(updatedUser);
        res.json({ success: true, updated, message: "تم تعديل الحساب" });
    }
    else {
        res.json({ success: false, message: "حدث خطأ" });
    }
});
exports.updateUser = updateUser;
const userLogin = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield userRepo.createQueryBuilder("users")
        .where("LOWER(users.username) LIKE LOWER(:query)", { query: `%${username.toLowerCase()}%` })
        .getOne();
    if (user) {
        if (user.password == password) {
            const token = jsonwebtoken_1.default.sign({ username }, "tayson", { expiresIn: '8h' });
            return res.json({ messsage: "تم تسجيل الدخول بنجاح ", success: true, token, username: user.username, expDate: Date.now() + 8 * 60 * 60 * 1000 });
        }
        else {
            return res.json({ message: "كلمة السر خطأ", success: false });
        }
    }
    else {
        return res.json({ message: "مستخدم غير موجود", success: false });
    }
});
exports.userLogin = userLogin;
const allUsers = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const users = yield userRepo.find();
    if (users.length > 0) {
        res.json({ message: "هناك مستخدم موجود بالفعل", existing: true });
    }
    else
        res.json({ existing: false, message: "لا يوجد مستخدمين" });
});
exports.allUsers = allUsers;
//# sourceMappingURL=users.controller.js.map