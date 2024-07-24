"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const users_controller_1 = require("../controllers/users.controller");
const user_auth_1 = require("../middleware/user.auth");
const express_1 = tslib_1.__importDefault(require("express"));
const userRouter = express_1.default.Router();
userRouter.use(user_auth_1.isAdmin);
userRouter.get('/', users_controller_1.allUsers);
userRouter.get('/:id', users_controller_1.findUser);
userRouter.delete('/:id', users_controller_1.deleteUser);
userRouter.put('/:id', users_controller_1.updateUser);
userRouter.post('/', users_controller_1.addUser);
exports.default = userRouter;
//# sourceMappingURL=users.router.js.map