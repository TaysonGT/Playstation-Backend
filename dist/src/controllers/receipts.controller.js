"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOuterReceipt = exports.allOuterReceipts = exports.createOuterReceipt = void 0;
const tslib_1 = require("tslib");
const reciept_entity_1 = require("../entity/reciept.entity");
const product_entity_1 = require("../entity/product.entity");
const app_data_source_1 = require("../app-data-source");
const recieptRepo = app_data_source_1.myDataSource.getRepository(reciept_entity_1.Receipt);
const productRepo = app_data_source_1.myDataSource.getRepository(product_entity_1.Product);
const createOuterReceipt = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { orderData } = req.body;
    const updatedOrders = [];
    let updatedProducts = null;
    if (orderData.length > 0) {
        let cost = 0;
        const cashier = req.cookies.username;
        for (const item of orderData) {
            const product = yield productRepo.findOne({ where: { id: item.id } });
            if (product) {
                cost += product.price * item.quantity;
                const stock = product.stock - item.quantity;
                const consumed = product.consumed + item.quantity;
                const updateProductsData = Object.assign(product, { stock, consumed });
                updatedProducts = yield productRepo.save(updateProductsData);
                let order_cost = product.price * item.quantity;
                updatedOrders.push(Object.assign(Object.assign({}, item), { order_cost }));
            }
        }
        const strData = JSON.stringify(updatedOrders);
        const receipt = recieptRepo.create({ cashier, orders: strData, total: cost });
        const saved = yield recieptRepo.save(receipt);
        res.json({ success: true, updatedProducts, message: "تم الطلب بنجاح", saved });
    }
    else {
        res.json({ success: false, message: "لا يوجد طلبات" });
    }
});
exports.createOuterReceipt = createOuterReceipt;
const allOuterReceipts = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const receipts = yield recieptRepo.find();
    res.json({ receipts });
});
exports.allOuterReceipts = allOuterReceipts;
const findOuterReceipt = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const receipt = yield recieptRepo.findOne({ where: { id } });
    res.json({ receipt });
});
exports.findOuterReceipt = findOuterReceipt;
//# sourceMappingURL=receipts.controller.js.map