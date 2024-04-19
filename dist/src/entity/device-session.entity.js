"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceSession = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const order_entity_1 = require("./order.entity");
let DeviceSession = class DeviceSession {
};
exports.DeviceSession = DeviceSession;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    tslib_1.__metadata("design:type", String)
], DeviceSession.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], DeviceSession.prototype, "device_id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    tslib_1.__metadata("design:type", String)
], DeviceSession.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: "end_at" }),
    tslib_1.__metadata("design:type", String)
], DeviceSession.prototype, "end_at", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('text', { default: "open" }),
    tslib_1.__metadata("design:type", String)
], DeviceSession.prototype, "time_type", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('text', { default: "single" }),
    tslib_1.__metadata("design:type", String)
], DeviceSession.prototype, "play_type", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => order_entity_1.Order, order => order.device_session_id),
    tslib_1.__metadata("design:type", Array)
], DeviceSession.prototype, "orders", void 0);
exports.DeviceSession = DeviceSession = tslib_1.__decorate([
    (0, typeorm_1.Entity)('sessions')
], DeviceSession);
//# sourceMappingURL=device-session.entity.js.map