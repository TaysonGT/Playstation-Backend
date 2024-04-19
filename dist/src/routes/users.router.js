"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const users_controller_1 = require("../controllers/users.controller");
const express_1 = tslib_1.__importDefault(require("express"));
const userRouter = express_1.default.Router();
userRouter.get('/find/:username', users_controller_1.findUser);
userRouter.delete('/delete', users_controller_1.deleteUser);
userRouter.post('/add', users_controller_1.addUser);
exports.default = userRouter;
//# sourceMappingURL=users.router.js.map