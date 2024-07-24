"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeOrder = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
let TimeOrder = class TimeOrder {
};
exports.TimeOrder = TimeOrder;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    tslib_1.__metadata("design:type", String)
], TimeOrder.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], TimeOrder.prototype, "session_id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], TimeOrder.prototype, "play_type", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], TimeOrder.prototype, "cost", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Date)
], TimeOrder.prototype, "start_at", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    tslib_1.__metadata("design:type", Date)
], TimeOrder.prototype, "end_at", void 0);
exports.TimeOrder = TimeOrder = tslib_1.__decorate([
    (0, typeorm_1.Entity)('time_orders')
], TimeOrder);
//# sourceMappingURL=time-order.entity.js.map