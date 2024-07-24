"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const finances_controller_1 = require("../controllers/finances.controller");
const express_1 = tslib_1.__importDefault(require("express"));
const financeRouter = express_1.default.Router();
financeRouter.get('/', finances_controller_1.allFinances);
financeRouter.get('/users', finances_controller_1.getUsersFinances);
financeRouter.post('/deduction', finances_controller_1.addDeduction);
financeRouter.delete('/deduction/:id', finances_controller_1.removeDeduction);
financeRouter.get('/:date/:user', finances_controller_1.statisticFinances);
exports.default = financeRouter;
//# sourceMappingURL=finance.router.js.map