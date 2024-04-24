"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGame = exports.addGame = exports.allGames = void 0;
const tslib_1 = require("tslib");
const app_data_source_1 = require("../app-data-source");
const game_entity_1 = require("../entity/game.entity");
const gameRepo = app_data_source_1.myDataSource.getRepository(game_entity_1.Game);
const allGames = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const games = yield gameRepo.find();
    res.json({ games });
});
exports.allGames = allGames;
const addGame = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const gameData = { name };
    const game = gameRepo.create(gameData);
    const created = yield gameRepo.save(game);
    res.json({ success: true, created, message: "تمت اللعبة بنجاح" });
});
exports.addGame = addGame;
const deleteGame = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const game = yield gameRepo.findOne({ where: { id } });
    if (game) {
        const deleted = yield gameRepo.remove(game);
        res.json({ success: true, deleted, message: "تمت إزالة اللعبة بنجاح" });
    }
    else {
        res.json({ success: false, message: "حدث  خطأ ما" });
    }
});
exports.deleteGame = deleteGame;
//# sourceMappingURL=games.controller.js.map