"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceType = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
let DeviceType = class DeviceType {
};
exports.DeviceType = DeviceType;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    tslib_1.__metadata("design:type", String)
], DeviceType.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], DeviceType.prototype, "name", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], DeviceType.prototype, "single_price", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], DeviceType.prototype, "multi_price", void 0);
exports.DeviceType = DeviceType = tslib_1.__decorate([
    (0, typeorm_1.Entity)('device_type')
], DeviceType);
//# sourceMappingURL=device-type.entity.js.map