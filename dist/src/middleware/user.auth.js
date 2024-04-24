"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSigned = exports.addAuth = exports.auth = void 0;
const tslib_1 = require("tslib");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const user_entity_1 = require("../entity/user.entity");
const app_data_source_1 = require("../app-data-source");
const userRepo = app_data_source_1.myDataSource.getRepository(user_entity_1.User);
const auth = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.access_token;
    if (!token) {
        res.json({ success: false, message: "You're not signed in" });
    }
    else {
        const verify = jsonwebtoken_1.default.verify(token, "tayson");
        verify ? next() : res.json({ message: "Invalid Session! Please Logout and Sign In again...", success: false });
    }
});
exports.auth = auth;
const addAuth = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const users = yield userRepo.find();
    users.length > 0 ? res.json({ existing: true, message: "هناك مستخدم بالفعل" }) : next();
});
exports.addAuth = addAuth;
const isSigned = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (req.cookies.access_token) {
        res.json({ message: "You're Already Signed In", success: false });
    }
    else {
        next();
    }
});
exports.isSigned = isSigned;
//# sourceMappingURL=user.auth.js.map