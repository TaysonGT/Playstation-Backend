"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Receipt = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
let Receipt = class Receipt {
};
exports.Receipt = Receipt;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    tslib_1.__metadata("design:type", String)
], Receipt.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Receipt.prototype, "cashier", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Receipt.prototype, "orders", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    tslib_1.__metadata("design:type", String)
], Receipt.prototype, "time_ordered", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], Receipt.prototype, "total", void 0);
exports.Receipt = Receipt = tslib_1.__decorate([
    (0, typeorm_1.Entity)('receipts')
], Receipt);
//# sourceMappingURL=reciept.entity.js.map