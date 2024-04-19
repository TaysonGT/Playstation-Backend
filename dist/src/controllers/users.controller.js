"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogout = exports.findUser = exports.userLogin = exports.addUser = exports.deleteUser = void 0;
const tslib_1 = require("tslib");
const app_data_source_1 = require("../app-data-source");
const user_entity_1 = require("../entity/user.entity");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const userRepo = app_data_source_1.myDataSource.getRepository(user_entity_1.User);
const findUser = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const username = req.params.username;
    const user = yield userRepo.findOne({ where: { username } });
    if (!user) {
        res.json("not found bruv");
    }
    else {
        res.json({ message: "found!", user });
    }
});
exports.findUser = findUser;
const addUser = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield userRepo.create({ username, password });
    const results = yield userRepo.save(user);
    res.json({ results, message: "User Added Successfully", success: true });
});
exports.addUser = addUser;
const deleteUser = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const user = yield userRepo.findOne({ where: { id } });
    if (user) {
        const results = yield userRepo.remove(user);
        res.json({ results, message: "User Removed successfully" });
    }
    else {
        res.json({ message: "User Not Found" });
    }
});
exports.deleteUser = deleteUser;
const userLogin = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield userRepo.findOne({ where: { username } });
    if (user) {
        if (user.password == password) {
            const token = jsonwebtoken_1.default.sign({ username }, "tayson", { expiresIn: '8h' });
            return res.json({ messsage: "Signed in Successfully", success: true, token, expDate: Date.now() + 8 * 60 * 60 * 1000 });
        }
        else {
            return res.json({ message: "Invalid Password", success: false });
        }
    }
    else {
        return res.json({ message: "Invalid Username", success: false });
    }
});
exports.userLogin = userLogin;
const userLogout = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    res.status(200)
        .json({ message: "Successfully logged out 😏 🍀", success: true });
});
exports.userLogout = userLogout;
//# sourceMappingURL=users.controller.js.map