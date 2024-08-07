"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const main_configs_controller_1 = require("../controllers/main-configs.controller");
const user_auth_1 = require("../middleware/user.auth");
const express_1 = tslib_1.__importDefault(require("express"));
const configsRouter = express_1.default.Router();
configsRouter.get('/', main_configs_controller_1.getConfigs);
configsRouter.put('/', user_auth_1.isAdmin, main_configs_controller_1.saveConfigs);
exports.default = configsRouter;
//# sourceMappingURL=main-configs.router.js.map