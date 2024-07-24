"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Device = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
let Device = class Device {
};
exports.Device = Device;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    tslib_1.__metadata("design:type", String)
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
    (0, typeorm_1.Column)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Device.prototype, "status", void 0);
exports.Device = Device = tslib_1.__decorate([
    (0, typeorm_1.Entity)('devices')
], Device);
//# sourceMappingURL=device.entity.js.map