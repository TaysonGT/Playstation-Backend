"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSigned = exports.auth = void 0;
const tslib_1 = require("tslib");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.access_token;
    // console.log(token)
    if (!token) {
        res.json(token);
    }
    const verify = jsonwebtoken_1.default.verify(token, "tayson");
    // return res.json({message: "Signed", code: 1})
    return res.json(verify);
});
exports.auth = auth;
const isSigned = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (req.session.authenticated) {
        res.json({ message: "Signed", code: 1 });
    }
    else {
        next();
    }
});
exports.isSigned = isSigned;
//# sourceMappingURL=user.auth.js.map