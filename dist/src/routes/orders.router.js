"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const orders_controller_1 = require("../controllers/orders.controller");
const express_1 = tslib_1.__importDefault(require("express"));
const ordersRouter = express_1.default.Router();
ordersRouter.get('/', orders_controller_1.allOrders);
ordersRouter.post('/:deviceId/:sessionId', orders_controller_1.addOrder);
ordersRouter.delete('/:deviceId/:sessionId', orders_controller_1.deleteOrder);
exports.default = ordersRouter;
//# sourceMappingURL=orders.router.js.map