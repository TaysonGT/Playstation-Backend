"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceGame = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
let DeviceGame = class DeviceGame {
};
exports.DeviceGame = DeviceGame;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    tslib_1.__metadata("design:type", String)
], DeviceGame.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], DeviceGame.prototype, "device_id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], DeviceGame.prototype, "game_id", void 0);
exports.DeviceGame = DeviceGame = tslib_1.__decorate([
    (0, typeorm_1.Entity)('device_games')
], DeviceGame);
//# sourceMappingURL=device-game.entity.js.map