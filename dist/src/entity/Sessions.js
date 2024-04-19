"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
let Session = class Session {
    constructor() {
        this.expiredAt = Date.now();
        this.id = "";
        this.json = "";
    }
};
exports.Session = Session;
tslib_1.__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)("bigint"),
    tslib_1.__metadata("design:type", Object)
], Session.prototype, "expiredAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.PrimaryColumn)("varchar", { length: 255 }),
    tslib_1.__metadata("design:type", Object)
], Session.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)("text"),
    tslib_1.__metadata("design:type", Object)
], Session.prototype, "json", void 0);
tslib_1.__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    tslib_1.__metadata("design:type", Object)
], Session.prototype, "destroyedAt", void 0);
exports.Session = Session = tslib_1.__decorate([
    (0, typeorm_1.Entity)()
], Session);
//# sourceMappingURL=Sessions.js.map