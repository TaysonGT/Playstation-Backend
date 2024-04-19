"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Finance = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
let Finance = class Finance {
};
exports.Finance = Finance;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    tslib_1.__metadata("design:type", String)
], Finance.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], Finance.prototype, "finances", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Finance.prototype, "time_order_id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Finance.prototype, "order_id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'added_at' }),
    tslib_1.__metadata("design:type", String)
], Finance.prototype, "added_at", void 0);
exports.Finance = Finance = tslib_1.__decorate([
    (0, typeorm_1.Entity)()
], Finance);
//# sourceMappingURL=finances.entity.js.map