"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const games_controller_1 = require("../controllers/games.controller");
const express_1 = tslib_1.__importDefault(require("express"));
const gamesRouter = express_1.default.Router();
gamesRouter.get('/', games_controller_1.allGames);
gamesRouter.post('/', games_controller_1.addGame);
gamesRouter.delete('/:id', games_controller_1.deleteGame);
exports.default = gamesRouter;
//# sourceMappingURL=games.router.js.map