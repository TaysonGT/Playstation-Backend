"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oneProduct = exports.deleteProduct = exports.updateProduct = exports.addProduct = exports.allProducts = exports.findProduct = void 0;
const tslib_1 = require("tslib");
const app_data_source_1 = require("../app-data-source");
const product_entity_1 = require("../entity/product.entity");
const productRepo = app_data_source_1.myDataSource.getRepository(product_entity_1.Product);
const findProduct = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const product = yield productRepo.find({ where: { id } });
    product ? res.json({ product }) : res.json({ message: "هذا المنتج غير موجود" });
});
exports.findProduct = findProduct;
const allProducts = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const products = yield productRepo.find();
    res.json({ products });
});
exports.allProducts = allProducts;
const addProduct = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { name, price, stock } = req.body;
    let consumed = 0;
    const product = productRepo.create({ name, price, stock, consumed });
    if (name && price && stock) {
        const isFound = yield productRepo.createQueryBuilder("products")
            .where("LOWER(products.name) LIKE LOWER(:query)", { query: `%${name.toLowerCase()}%` })
            .getOne();
        if (!isFound) {
            const created = yield productRepo.save(product);
            res.json({ success: true, created, message: "تمت إضافة المنتج بنجاح" });
        }
        else
            res.json({ success: false, message: "هذا المنتج موجود بالفعل", isFound });
    }
    else
        res.json({ succes: false, message: "برجاء ملء جميع البيانات" });
});
exports.addProduct = addProduct;
const updateProduct = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const product = yield productRepo.findOne({ where: { id } });
    const { name, price, stock } = req.body;
    if (product) {
        let productData = { name, price, stock, consumed: product.consumed };
        const updatedProduct = Object.assign(product, productData);
        const updated = yield productRepo.save(updatedProduct);
        res.json({ success: true, updated, message: "تم تحديث المنتج بنجاح" });
    }
    else {
        res.json({ success: false, message: "هذا المنتج غير موجود" });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const product = yield productRepo.findOne({ where: { id } });
    if (product) {
        const deleted = yield productRepo.remove(product);
        res.json({ success: true, deleted, message: "تمت إزالة المنتج بنجاح" });
    }
    else {
        res.json({ success: false, message: "حدث خطأ" });
    }
});
exports.deleteProduct = deleteProduct;
const oneProduct = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const product = yield productRepo.findOne({ where: { id } });
    if (product) {
        res.json({ product });
    }
    else {
        res.json({ message: "حدث خطأ ما", success: false });
    }
});
exports.oneProduct = oneProduct;
//# sourceMappingURL=products.controller.js.map