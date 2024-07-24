"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
let Product = class Product {
};
exports.Product = Product;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    tslib_1.__metadata("design:type", String)
], Product.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Product.prototype, "name", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], Product.prototype, "price", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], Product.prototype, "stock", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], Product.prototype, "consumed", void 0);
exports.Product = Product = tslib_1.__decorate([
    (0, typeorm_1.Entity)('products')
], Product);
//# sourceMappingURL=product.entity.js.map