"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const finances_controller_1 = require("../controllers/finances.controller");
const express_1 = tslib_1.__importDefault(require("express"));
const financeRouter = express_1.default.Router();
financeRouter.get('/:date', finances_controller_1.allFinances);
exports.default = financeRouter;
//# sourceMappingURL=finance.router.js.map