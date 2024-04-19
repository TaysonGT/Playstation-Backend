"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
let Game = class Game {
};
exports.Game = Game;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], Game.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Game.prototype, "name", void 0);
exports.Game = Game = tslib_1.__decorate([
    (0, typeorm_1.Entity)('games')
], Game);
//# sourceMappingURL=game.entity.js.map