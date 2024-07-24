"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const orders_controller_1 = require("../controllers/orders.controller");
const express_1 = tslib_1.__importDefault(require("express"));
const ordersRouter = express_1.default.Router();
ordersRouter.post('/:sessionId', orders_controller_1.addOrder);
ordersRouter.delete('/:sessionId', orders_controller_1.deleteOrder);
ordersRouter.get('/outer', orders_controller_1.allOuterOrders);
ordersRouter.get('/:id', orders_controller_1.sessionOrders);
ordersRouter.get('/', orders_controller_1.allOrders);
exports.default = ordersRouter;
//# sourceMappingURL=orders.router.js.map