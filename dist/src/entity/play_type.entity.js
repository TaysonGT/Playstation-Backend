"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceType = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
let deviceType = class deviceType {
};
exports.deviceType = deviceType;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    tslib_1.__metadata("design:type", String)
], deviceType.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], deviceType.prototype, "name", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], deviceType.prototype, "single_price", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], deviceType.prototype, "multi_price", void 0);
exports.deviceType = deviceType = tslib_1.__decorate([
    (0, typeorm_1.Entity)('device_type')
], deviceType);
//# sourceMappingURL=play_type.entity.js.map