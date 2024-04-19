"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
let Order = class Order {
};
exports.Order = Order;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    tslib_1.__metadata("design:type", String)
], Order.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Order.prototype, "product_id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], Order.prototype, "quantity", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Order.prototype, "device_session_id", void 0);
exports.Order = Order = tslib_1.__decorate([
    (0, typeorm_1.Entity)('orders')
], Order);
//# sourceMappingURL=order.entity.js.map