"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Device = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const game_entity_1 = require("./game.entity");
let Device = class Device {
};
exports.Device = Device;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], Device.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Device.prototype, "name", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Device.prototype, "type", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Boolean)
], Device.prototype, "status", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToMany)(() => game_entity_1.Game, game => game.id),
    (0, typeorm_1.JoinTable)(),
    tslib_1.__metadata("design:type", Array)
], Device.prototype, "games", void 0);
exports.Device = Device = tslib_1.__decorate([
    (0, typeorm_1.Entity)('devices')
], Device);
//# sourceMappingURL=device.entity.js.map