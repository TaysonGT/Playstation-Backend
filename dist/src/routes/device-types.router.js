"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const devices_contoller_1 = require("../controllers/devices.contoller");
const user_auth_1 = require("../middleware/user.auth");
const express_1 = tslib_1.__importDefault(require("express"));
const deviceTypesRouter = express_1.default.Router();
deviceTypesRouter.get('/', devices_contoller_1.allDeviceTypes);
deviceTypesRouter.post('/', user_auth_1.isAdmin, devices_contoller_1.addDeviceType);
deviceTypesRouter.put('/:id', user_auth_1.isAdmin, devices_contoller_1.updateDeviceType);
deviceTypesRouter.get('/:id', devices_contoller_1.findDeviceType);
exports.default = deviceTypesRouter;
//# sourceMappingURL=device-types.router.js.map