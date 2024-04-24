"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeReceipt = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
let TimeReceipt = class TimeReceipt {
};
exports.TimeReceipt = TimeReceipt;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    tslib_1.__metadata("design:type", String)
], TimeReceipt.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)({ default: Date.now() }),
    tslib_1.__metadata("design:type", Date)
], TimeReceipt.prototype, "end_at", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], TimeReceipt.prototype, "orders", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], TimeReceipt.prototype, "time_orders", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], TimeReceipt.prototype, "total", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], TimeReceipt.prototype, "cashier", void 0);
exports.TimeReceipt = TimeReceipt = tslib_1.__decorate([
    (0, typeorm_1.Entity)('time_receipt')
], TimeReceipt);
//# sourceMappingURL=time-receipt.entity.js.map