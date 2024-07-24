"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.auth = void 0;
const tslib_1 = require("tslib");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const user_entity_1 = require("../entity/user.entity");
const app_data_source_1 = require("../app-data-source");
const userRepo = app_data_source_1.myDataSource.getRepository(user_entity_1.User);
const auth = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.toString().split(' ')[1];
    if (token) {
        const verify = jsonwebtoken_1.default.verify(token, "tayson");
        verify ? next() : res.json({ message: "Invalid Session! Please Logout and Sign In again...", success: false });
    }
    else {
        res.json({ success: false, message: "You're not signed in" });
    }
});
exports.auth = auth;
const isAdmin = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req.headers.user_id) === null || _a === void 0 ? void 0 : _a.toString().split(' ')[1];
    const user = yield userRepo.findOne({ where: { id } });
    user && !user.admin ? res.json({ success: false, message: "هذا المستخدم لا يملك الصلاحيات لفعل هذا الأمر" }) : next();
});
exports.isAdmin = isAdmin;
//# sourceMappingURL=user.auth.js.map