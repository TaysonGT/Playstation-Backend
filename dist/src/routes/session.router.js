"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const session_controller_1 = require("../controllers/session.controller");
const express_1 = tslib_1.__importDefault(require("express"));
const sessionRouter = express_1.default.Router();
sessionRouter.get('/', session_controller_1.allSessions);
sessionRouter.put('/play-type/:id', session_controller_1.changePlayType);
sessionRouter.put('/change-device/:id', session_controller_1.changeDevice);
sessionRouter.post('/:id', session_controller_1.addSession);
sessionRouter.get('/:id', session_controller_1.findSession);
sessionRouter.delete('/:id', session_controller_1.endSession);
exports.default = sessionRouter;
//# sourceMappingURL=session.router.js.map