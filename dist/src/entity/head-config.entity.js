"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeadConfig = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
let HeadConfig = class HeadConfig {
};
exports.HeadConfig = HeadConfig;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    tslib_1.__metadata("design:type", String)
], HeadConfig.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], HeadConfig.prototype, "key", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], HeadConfig.prototype, "value", void 0);
exports.HeadConfig = HeadConfig = tslib_1.__decorate([
    (0, typeorm_1.Entity)('head_config')
], HeadConfig);
//# sourceMappingURL=head-config.entity.js.map