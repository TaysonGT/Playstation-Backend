"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const devices_contoller_1 = require("../controllers/devices.contoller");
const user_auth_1 = require("../middleware/user.auth");
const express_1 = tslib_1.__importDefault(require("express"));
const devicesRouter = express_1.default.Router();
devicesRouter.get('/', devices_contoller_1.allDevices);
devicesRouter.post('/', user_auth_1.isAdmin, devices_contoller_1.addDevice);
devicesRouter.post('/:id', user_auth_1.isAdmin, devices_contoller_1.updateDevice);
devicesRouter.delete('/:id', user_auth_1.isAdmin, devices_contoller_1.deleteDevice);
devicesRouter.get('/:id', devices_contoller_1.findDevice);
exports.default = devicesRouter;
//# sourceMappingURL=devices.router.js.map