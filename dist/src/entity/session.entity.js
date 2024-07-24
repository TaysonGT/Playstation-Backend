"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const order_entity_1 = require("./order.entity");
let Session = class Session {
};
exports.Session = Session;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    tslib_1.__metadata("design:type", String)
], Session.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Session.prototype, "device_id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    tslib_1.__metadata("design:type", String)
], Session.prototype, "start_at", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: "end_at", nullable: true }),
    tslib_1.__metadata("design:type", String)
], Session.prototype, "end_at", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('text'),
    tslib_1.__metadata("design:type", String)
], Session.prototype, "time_type", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('text'),
    tslib_1.__metadata("design:type", String)
], Session.prototype, "play_type", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => order_entity_1.Order, order => order.device_session_id),
    tslib_1.__metadata("design:type", Array)
], Session.prototype, "orders", void 0);
exports.Session = Session = tslib_1.__decorate([
    (0, typeorm_1.Entity)('sessions')
], Session);
//# sourceMappingURL=session.entity.js.map