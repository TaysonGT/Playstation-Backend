"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const receipts_controller_1 = require("../controllers/receipts.controller");
const express_1 = tslib_1.__importDefault(require("express"));
const receiptsRouter = express_1.default.Router();
receiptsRouter.post('/outer', receipts_controller_1.createOuterReceipt);
receiptsRouter.get('/outer', receipts_controller_1.allOuterReceipts);
receiptsRouter.get('/session', receipts_controller_1.allSessionReceipts);
receiptsRouter.get('/outer/:id', receipts_controller_1.findOuterReceipt);
receiptsRouter.get('/session/:id', receipts_controller_1.findSessionReceipt);
exports.default = receiptsRouter;
//# sourceMappingURL=receipts.router.js.map