"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.addOrder = exports.allOrders = void 0;
const tslib_1 = require("tslib");
const app_data_source_1 = require("../app-data-source");
const order_entity_1 = require("../entity/order.entity");
const product_entity_1 = require("./../entity/product.entity");
const device_entity_1 = require("../entity/device.entity");
const orderRepo = app_data_source_1.myDataSource.getRepository(order_entity_1.Order);
const deviceRepo = app_data_source_1.myDataSource.getRepository(device_entity_1.Device);
const productRepo = app_data_source_1.myDataSource.getRepository(product_entity_1.Product);
const allOrders = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const orders = yield orderRepo.find();
    res.json({ orders });
});
exports.allOrders = allOrders;
const addOrder = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { product_id, quantity } = req.body;
    const { sessionId, deviceId } = req.params;
    const product = yield productRepo.findOne({ where: { id: product_id } });
    const device = yield deviceRepo.findOne({ where: { id: deviceId } });
    if (product && device) {
        const cost = product.price * quantity;
        const orderData = { product_id, quantity, device_session_id: sessionId, device_name: device.name, cost };
        const order = orderRepo.create(orderData);
        const created = yield orderRepo.save(order);
        const stock = product.stock - quantity;
        const consumed = product.consumed + quantity;
        const updateProductsData = Object.assign(product, { stock, consumed });
        const updatedProducts = yield productRepo.save(updateProductsData);
        res.json({ success: true, created, updatedProducts, message: "تمت إضافةالطلب بنجاح" });
    }
    else
        res.json({ success: false, message: "حدث خطأ" });
});
exports.addOrder = addOrder;
const deleteOrder = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const order = yield orderRepo.findOne({ where: { id } });
    const product = yield productRepo.findOne({ where: { id: order === null || order === void 0 ? void 0 : order.product_id } });
    if (order && product) {
        const deleted = yield orderRepo.remove(order);
        const stock = product.stock - order.quantity;
        const consumed = product.consumed + order.quantity;
        const updateProductsData = Object.assign(product, { stock, consumed });
        const updatedProducts = yield productRepo.save(updateProductsData);
        res.json({ success: true, deleted, updatedProducts, message: "تم حذف الطلب بنجاح" });
    }
    else {
        res.json({ success: false, message: "هذا الطلب غير موجود" });
    }
});
exports.deleteOrder = deleteOrder;
//# sourceMappingURL=orders.controller.js.map